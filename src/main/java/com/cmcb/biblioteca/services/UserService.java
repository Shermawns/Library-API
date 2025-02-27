package com.cmcb.biblioteca.services;

import com.cmcb.biblioteca.exceptions.PasswordInvalidException;
import com.cmcb.biblioteca.models.User;
import com.cmcb.biblioteca.repositories.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }

    public User findById(Long id){
        return userRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(String.format("Usuário %s não foi encontrado no sistema", id))
        );
    }

    public User save(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new DataIntegrityViolationException("O usuário '" + user.getUsername() + "' já está registrado.");
        }
        return userRepository.save(user);
    }


    public User editPassword(Long id, String currentPassword, String newPassword, String confirmPassword){

        User user = findById(id);

        if (!passwordEncoder.matches(currentPassword, user.getPassword())){
            throw new PasswordInvalidException("A senha atual está errada");
        }

        if (!newPassword.equals(confirmPassword)){
            throw new PasswordInvalidException("A nova senha não é igual a segunda senha.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));


        return userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username);
    }
}