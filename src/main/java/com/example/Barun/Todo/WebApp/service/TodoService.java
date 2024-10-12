package com.example.Barun.Todo.WebApp.service;

import com.example.Barun.Todo.WebApp.model.Todo;
import com.example.Barun.Todo.WebApp.repository.TodoRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class TodoService {

    @Autowired
    private TodoRepo todoRepo;

    public List<Todo> getAllTodos() {
        return todoRepo.findAll();
    }

    public void deleteAllTodos() {
         todoRepo.deleteAll();
    }

    public Todo getTodoById (Long id) {
        return todoRepo.findById(id).orElseThrow(() -> new RuntimeException("Todo not found" + id));
    }

    public Todo createTodo(Todo todo) {
        todo.setCreateAt(LocalDateTime.now());
        return todoRepo.save(todo);
    }

    @Transactional
    public Todo updateTodo(Long id, Todo updatedTodo) {
        Todo todo = getTodoById(id);
        todo.setTitle(updatedTodo.getTitle());
        todo.setDescription(updatedTodo.getDescription());
        todo.setCompleted(updatedTodo.isCompleted());
        return todoRepo.save(todo);
    }

    public void deleteTodo(Long id) {
        todoRepo.deleteById(id);
    }
}
