package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"math/rand"
	"net/http"
	"path/filepath"
)


func initWords() []string {
  return []string {
    "apple", "banana", "cherry",
  }
}


func main() {

    words := initWords()

    fs := http.FileServer(http.Dir("static"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))

    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request){
      // Finds the templates
      tmpl, err := template.ParseFiles(filepath.Join("templates", "Index.html"))
      // If there are anything wrong with the files we return a server error
      if err != nil{
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
      }
      // Else we return the view
      tmpl.Execute(w, nil);
    })

    http.HandleFunc("/game", func(w http.ResponseWriter, r *http.Request) {
      tmpl, err := template.ParseFiles(filepath.Join("templates", "Game1.html"))
      if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
      }
      tmpl.Execute(w, nil)
    })

    http.HandleFunc("/getNewWord", func(w http.ResponseWriter, r *http.Request){
      word := words[rand.Intn(len(words))]
      w.Header().Set("Content-Type", "application/json")
      json.NewEncoder(w).Encode(map[string]string{"word": word})
    })

    fmt.Println("Server is running on http://localhost:8080")
    http.ListenAndServe(":8080", nil)
}

