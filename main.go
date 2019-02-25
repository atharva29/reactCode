package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"runtime"
	"strings"
	"time"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	_ "github.com/mattn/go-sqlite3" // database
)

// This our Data structure beteween edge and cloud communication
type NodeInfo struct {
	Id         int      // Id of the device which is connected to the Edge
	Data       float64  // Data of particular device connected to Edge
	DeviceName string   // Name of the Edge
	Date_time  int64    // Date and time of data
	AllId      []string // Gives all the Ids of device connected to the Edge
}

type Info struct {
	Id      string
	Command string
}

var clientConnections, deleteClientConnection, dataToWeb = make(chan *websocket.Conn), make(chan *websocket.Conn), make(chan NodeInfo)

var data_to_db = make(chan NodeInfo)
var deleteEdgeConn = make(chan *websocket.Conn)
var addEdgeConnection = make(chan *websocket.Conn)
var writeNode = make(chan Info)
var newWebConnection = make(chan int)

// var deleteEdgeConn = make(chan *websocket.Conn)
// var addEdgeConnection = make(chan *websocket.Conn)

func main() {

	go EdgeMapper()
	go mapClients()
	go handleDb()
	router := mux.NewRouter()
	router.HandleFunc("/", simpleHandler)
	router.HandleFunc("/webSocket", handleClientSocket)
	router.HandleFunc("/ws", handleEdgeSocket)
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./")))

	err := http.ListenAndServe(":4000", router)

	//	err := http.ListenAndServe(":"+os.Getenv("PORT"), router)
	if err != nil {
		panic(err)
	}
}

func EdgeMapper() {
	temp := 0
	var EdgeMapper = make(map[int]*websocket.Conn)
	for {
		select {
		case conn := <-addEdgeConnection:
			{
				fmt.Println("Message Refresh : Recieved a New Connection")
				EdgeMapper[temp] = conn
				fmt.Println("EdgeMapper ", EdgeMapper)
				temp = temp + 1
				fmt.Println("temp ", temp)
			}

		case del := <-deleteEdgeConn:
			{
				for k, v := range EdgeMapper {
					if v == del {
						delete(EdgeMapper, k)
						fmt.Println("newmap:", EdgeMapper)
					}
				}
			}
		case text := <-writeNode:
			{
				for _, conn := range EdgeMapper {
					err := conn.WriteJSON(text)
					if err != nil {
						fmt.Println(err)
					}
					fmt.Println("Written Successfully on Edge")
				}
			}
		}
	}
}

func handleEdgeSocket(w http.ResponseWriter, r *http.Request) {
	upgrader := websocket.Upgrader{}
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("Upgrading To Websocket Error : ", err)
		return
	}
	fmt.Println("Connected To Edge Device")
	addEdgeConnection <- conn
	go readEdgeConnection(conn)
}

func readEdgeConnection(conn *websocket.Conn) {
	for {
		var Msg NodeInfo
		err := conn.ReadJSON(&Msg)
		if err != nil {
			fmt.Println("Error in reading")
			deleteEdgeConn <- conn
			return
		}
		fmt.Println("Write Web")
		data_to_db <- Msg
		dataToWeb <- Msg
	}
}

// This Function add or deletes the client connection from the Map of connection
func mapClients() {
	// This variable has the count of number of Connections
	clientConnectionNumber := 0
	// This variable maps count with client connection
	var clientConnectionsMap = make(map[int]*websocket.Conn)
	//Sending pings to client websites
	ticker := time.NewTicker(20 * time.Second)
	defer ticker.Stop()

	for {
		select {
		// If a new connection is avaialble the add it to the map
		case newClientConnection := <-clientConnections:
			{
				clientConnectionsMap[clientConnectionNumber] = newClientConnection
				clientConnectionNumber++
				fmt.Println("New Client Added :: Number : ", clientConnectionNumber, "Length :: ", len(clientConnectionsMap))
				newWebConnection <- 1

			}
		// if a connection has to be deleted from the map variable
		case deleteClientConnection := <-deleteClientConnection:
			{
				for index, conn := range clientConnectionsMap {
					if conn == deleteClientConnection {
						delete(clientConnectionsMap, index)
						fmt.Println("Old Client Deleted :: Number : ", clientConnectionNumber, ", Index :: ", index, ", Length :: ", len(clientConnectionsMap))
					}
				}
			}
			// forward data coming from edge directly to web without db
		case msg := <-dataToWeb:
			{
				fmt.Println("Data - ", msg)
				for _, conn := range clientConnectionsMap {
					//	if msg.Id != 0 && msg.Data != 0 {
					if msg.Id != 0 {
						err := conn.WriteJSON(msg)
						if err != nil {
							fmt.Println(err)
						}
					}
				}
			}
			//// Maintains Constant Ping with Websites's Websocket
		case <-ticker.C:
			{

				for _, conn := range clientConnectionsMap {

					err := conn.WriteMessage(websocket.PingMessage, []byte{})
					if err != nil {
						fmt.Println("Websocket ping fail", runtime.NumGoroutine())
						return
					} else {
						fmt.Println("Successful Ping to web ")
					}
				}
			}
		}
	}
}

func simpleHandler(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "index.html")
}

// upgrades the client request to websocket and initializes reading and writing from connection
func handleClientSocket(w http.ResponseWriter, r *http.Request) {
	upgrader := websocket.Upgrader{}
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal("Upgrading To Websocket Error : ", err)
		return
	}
	// add the new client connection to the map of connection
	clientConnections <- conn

	// read from connection, only to check if connection is alive
	go readClientSocket(conn)
	// write from connection
}

// read from connection and check if alive, if not break the connection and delete the client connection from map
func readClientSocket(conn *websocket.Conn) {
	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error in reading from Client Socket")
			deleteClientConnection <- conn
			return
		}
		x := string(p)
		s := strings.Split(x, ",")
		var Data Info
		Data.Id = s[0]
		Data.Command = s[1]
		writeNode <- Data
		fmt.Println(x)
	}
}

func handleDb() {

	os.Remove("./cloud.db")
	database, _ := sql.Open("sqlite3", "./cloud.db")                                                                                                                 // creates a new db file
	statement, _ := database.Prepare("CREATE TABLE IF NOT EXISTS student (num INTEGER PRIMARY KEY,ID INT NULL,DEVICENAME TEXT NULL, DATA REAL NULL,date_time INT )") //create table
	statement.Exec()                                                                                                                                                 // execute create table statement
	statement, _ = database.Prepare("INSERT INTO student (num,ID,DEVICENAME,DATA,date_time) VALUES (?,?,?,?,?)")                                                     // make statement for entering values afterwards

	statement4, _ := database.Prepare("CREATE TABLE IF NOT EXISTS counter(num INTEGER PRIMARY KEY,ID1 INTEGER NULL )") //create table
	statement4.Exec()                                                                                                  // execute create table statement
	statement4, _ = database.Prepare("INSERT INTO counter (num,ID1) VALUES (?,?)")                                     // make statement for entering values afterwards
	statement4.Exec(1, 0)

	numStatement, _ := database.Prepare("UPDATE counter SET ID1 =? WHERE num = 1;")

	rows, _ := database.Query("select * from counter where num = 1")
	var num int
	var ID1 int
	for rows.Next() {
		rows.Scan(&num, &ID1)
		fmt.Println("retrived Rows are  ID1 = ", ID1-1)
		num = ID1 + 1
	}

	for {
		select {
		case Msg := <-data_to_db:
			{

				statement.Exec(num, Msg.Id, Msg.DeviceName, Msg.Data, Msg.Date_time) // put data to database
				fmt.Println(num, Msg.Id, Msg.DeviceName, Msg.Data)
				num = num + 1
				numStatement.Exec(num)

			}
		case <-newWebConnection:
			{
				///query is passed to database and then response is sent to passServer channel
				rows, err := database.Query("select * from student;")
				if err != nil {
					fmt.Println("ERROR ROWS", err)
					break
				}
				var num int
				var ID int
				var NAME string
				var date_time int64
				var data float64
				for rows.Next() {
					rows.Scan(&num, &ID, &NAME, &data, &date_time)
					var total NodeInfo
					total.Id = ID
					total.DeviceName = NAME
					total.Data = data
					total.Date_time = date_time
					//fmt.Println(total)
					dataToWeb <- total
				}

			}
		}
	}
}
