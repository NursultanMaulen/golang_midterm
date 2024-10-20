package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB;
var err error;

func connectDB(){
    dsn := "host=localhost user=postgres password=admin dbname=tasksdb port=5432 sslmode=disable"
    db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatal("FAIL CONNECTING: ", err)
    }

    log.Println("SUCCESS CONNECTION TO DB")
}

type User struct {
    ID    uint   `gorm:"primaryKey"`
    Name  string `json:"name"`
    Email string `json:"email"`
    Tasks []Task 
}

type Task struct {
    ID          uint   `gorm:"primaryKey"`
    Title       string `json:"title"`
    Description string `json:"description"`
    IsComplete  bool   `json:"is_complete"`
    UserID      uint   
}

func createUser(db *gorm.DB, name string, email string) {
    user := User{Name: name, Email: email}
    if err := db.Create(&user).Error; err != nil {
        fmt.Println("ERROR CREATING USER:", err)
    } else {
        fmt.Println("USER CREATED:", user)
    }
}

func createTask(w http.ResponseWriter, r *http.Request) {
    var task Task
    if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    db.Create(&task)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(task)
}

func getTasks(w http.ResponseWriter, r *http.Request) {
    var tasks []Task
    db.Find(&tasks)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(tasks)
}

func getUsers(w http.ResponseWriter, r *http.Request) {
    var users []User
    db.Find(&users)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
}

func getTask(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id := vars["id"]

    var task Task
    if err := db.First(&task, id).Error; err != nil {
        http.Error(w, "TASK NOT FOUND:", http.StatusNotFound)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(task)
}

func updateTask(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    id := vars["id"]

    var task Task
    if err := db.First(&task, id).Error; err != nil {
        http.Error(w, "TASK NOT FOUND", http.StatusNotFound)
        return
    }

    if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    db.Save(&task)
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(task)
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    idStr := vars["id"]

    id, err := strconv.ParseUint(idStr, 10, 32)
    if err != nil {
        http.Error(w, "Invalid task ID", http.StatusBadRequest)
        return
    }

    if err := db.Delete(&Task{}, id).Error; err != nil {
        http.Error(w, "TASK NOT FOUND", http.StatusNotFound)
        return
    }

    w.WriteHeader(http.StatusNoContent)
}


func (t *Task) CompleteTask() {
	t.IsComplete = true
	fmt.Println("TASK COMPLETED!!!")
}


func main(){
	connectDB()
	db.AutoMigrate(&User{}, &Task{})
	// createUser(db, "NURS", "NURS@example.com")
    // createTask(db, "TASK 1", "DESCR 1", 1)
    // createTask(db, "TASK 2", "DESCR 2", 1)
	// deleteTask(db, 3)
    // getUserTasks(db, 1)
	// getTasks(db)

	// ROUTESS

	router := mux.NewRouter()
    router.HandleFunc("/tasks", createTask).Methods("POST")
    router.HandleFunc("/tasks", getTasks).Methods("GET")
    router.HandleFunc("/tasks/{id}", getTask).Methods("GET")
    router.HandleFunc("/tasks/{id}", updateTask).Methods("PUT")
    router.HandleFunc("/tasks/{id}", deleteTask).Methods("DELETE")
	router.HandleFunc("/users", getUsers).Methods("GET")

    c := cors.New(cors.Options{
        AllowedOrigins:   []string{"http://localhost:3000"}, 
        AllowCredentials: true,
        AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowedHeaders:   []string{"Content-Type", "Authorization"},
    })

    handler := c.Handler(router)

    // router.POST("/tasks", createTask)
    // router.GET("/tasks", getTasks)
	// router.GET("/tasks/{id}", getTask)
	// router.PUT("/tasks/{id}", updateTask)
	// router.DELETE("/tasks/{id}", deleteTask)
	// router.GET("/users", getUsers)

    // router.HandleFunc("/tasks/{id}", updateTask).Methods("PUT")
    // router.HandleFunc("/tasks/{id}", deleteTask).Methods("DELETE")
	// router.HandleFunc("/users", getUsers).Methods("GET")

	http.ListenAndServe(":8080", handler)
}