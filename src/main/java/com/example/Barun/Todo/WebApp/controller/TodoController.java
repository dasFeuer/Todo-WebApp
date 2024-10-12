package com.example.Barun.Todo.WebApp.controller;

import com.example.Barun.Todo.WebApp.model.Todo;
import com.example.Barun.Todo.WebApp.service.TodoService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todo")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", allowCredentials = "true")
@Validated
public class TodoController {

    @Autowired
    private TodoService todoService;

    @GetMapping("/")
    public String greet(HttpServletRequest request) {
        return "Hello! Welcome to Todo Webapp.";

    }
    @GetMapping("/todos/{id}")
    public Todo getTodoById(@PathVariable Long id){
        return todoService.getTodoById(id);
    }

    @GetMapping("/todos")
    public List<Todo> getAllTodo() {
        return todoService.getAllTodos();
    }

    @PostMapping("/todos")
    public Todo createTodo(@RequestBody Todo todo) {
        return todoService.createTodo(todo);
    }

    @PutMapping("/todos/{id}")
    public Todo updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        return todoService.updateTodo(id, todo);
    }

    @DeleteMapping("/todos/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
    }

    @DeleteMapping("/todos")
    public void deleteAllTodo() {
        todoService.deleteAllTodos();
    }

    @GetMapping("/csrf-token")
    public CsrfToken getCsrfToken(HttpServletRequest request) {

        return (CsrfToken) request.getAttribute("_csrf");
    }

}
