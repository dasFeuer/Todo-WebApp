package com.example.Barun.Todo.WebApp.repository;

import com.example.Barun.Todo.WebApp.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepo extends JpaRepository<Todo, Long> {
}
