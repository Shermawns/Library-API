package com.cmcb.biblioteca.repositories;

import com.cmcb.biblioteca.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserRepository extends JpaRepository<User, Long> {
    UserDetails findByUsername(String username);
    boolean existsByUsername(String username);
}
