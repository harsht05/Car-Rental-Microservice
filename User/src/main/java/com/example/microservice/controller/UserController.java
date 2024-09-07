package com.example.microservice.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.example.microservice.entitiy.UserEntity;
import com.example.microservice.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserService userService;

	
    private Logger logger = LoggerFactory.getLogger(UserController.class);
    
    

    @GetMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7);
        DecodedJWT decodedJWT = JWT.decode(jwtToken);

        String userId = decodedJWT.getClaim("uid").asString();
        List<String> roles = decodedJWT.getClaim("myclaim").asList(String.class);
        String userEmail = decodedJWT.getClaim("sub").asString();
        String username = decodedJWT.getClaim("sub").asString().split("@")[0];
        String address = decodedJWT.getClaim("address").isNull() ? "Unknown" : decodedJWT.getClaim("address").asString();

        logger.info("Login request for user with ID: {}", userId);

        Map<String, String> response = new HashMap<>();
        response.put("userId", userId);
        response.put("username", username);
        response.put("address", address);
        response.put("email", userEmail);

        if (roles.contains("User")) {
            if (userService.isNewUser(userId)) {
                userService.createUser(userId, username, address, userEmail, roles);
                logger.info("New user created and logged in with ID: {}", userId);
                response.put("message", "New user created and logged in.");
                return ResponseEntity.status(HttpStatus.CREATED).body(response);
            } else {
                logger.info("Returning user logged in with ID: {}", userId);
                response.put("message", "Returning user logged in.");
                return ResponseEntity.ok(response);
            }
        } else if (roles.contains("Admin")) {
            logger.info("Admin user logged in with ID: {}", userId);
            response.put("message", "Admin logged in.");
            return ResponseEntity.ok(response);
        } else {
            logger.warn("Access denied for user with ID: {}", userId);
            response.put("message", "Access denied.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

	@PreAuthorize("hasAuthority('Admin')")
	@GetMapping("/get-all-user")
	public List<UserEntity> getAllUsers() {
        logger.info("In get all user");
		return userService.getAllUsers();
	}

	
	@PreAuthorize("hasAuthority('Admin') || hasAuthority('User')")
	@GetMapping("/get-single-user/{id}")
	public ResponseEntity<UserEntity> getUserById(@PathVariable String id) {
        logger.info("In get single user with id: {}", id);
		UserEntity user = userService.getUserById(id);
		if (user != null) {
			return ResponseEntity.ok(user);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	@PreAuthorize("hasAuthority('User')")
	@PutMapping("/update-user/{id}")
	public ResponseEntity<UserEntity> updateUser(@PathVariable String id, @RequestBody UserEntity userDetails) {
		return ResponseEntity.ok(userService.updateUser(id, userDetails));
	}

	@PreAuthorize("hasAuthority('User') || hasAuthority('Admin')")
	@DeleteMapping("delete-user/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable String id) {
		userService.deleteUser(id);
		return ResponseEntity.noContent().build();
	}
}