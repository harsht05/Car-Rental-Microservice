package com.example.microservice;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import java.util.Arrays;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.example.microservice.controller.UserController;
import com.example.microservice.entitiy.UserEntity;
import com.example.microservice.repository.UserRepository;
import com.example.microservice.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.auth0.jwt.JWT;
import com.auth0.jwt.interfaces.DecodedJWT;

@WebMvcTest(UserController.class)
@ExtendWith(MockitoExtension.class)
public class UserControllerTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private UserService userService;

	@MockBean
	private UserRepository userRepository;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private WebApplicationContext webApplicationContext;

	@BeforeEach
	public void setup() {
		mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).apply(springSecurity()).build();
	}

	@Test
	@WithMockUser(authorities = "Admin")
	void testGetAllUsers() throws Exception {
		UserEntity user1 = new UserEntity("1", "Tanish", "tansih@gmail.com", "kalyani nagar", "user", null);
		UserEntity user2 = new UserEntity("2", "Chinmaye", "chinmaye@gmail.com", "pimpri", "user", null);

		Mockito.when(userService.getAllUsers()).thenReturn(Arrays.asList(user1, user2));

		mockMvc.perform(get("/api/users/get-all-user")).andExpect(status().isOk())
				.andExpect(content().json(objectMapper.writeValueAsString(Arrays.asList(user1, user2))));
	}

	@Test
	@WithMockUser(authorities = "User")
	void testGetUserById() throws Exception {
		UserEntity user = new UserEntity("1", "Tanish", "tansih@gmail.com", "kalyani nagar", "user", null);

		Mockito.when(userService.getUserById("1")).thenReturn(user);

		mockMvc.perform(get("/api/users/get-single-user/1")).andExpect(status().isOk())
				.andExpect(content().json(objectMapper.writeValueAsString(user)));
	}

	
	
	 @Test
	    @WithMockUser(authorities = "User")
	    void testLoginUser() throws Exception {
	        // Mock JWT token
	        String token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwidWlkIjoiMSIsImFkZHJlc3MiOiJVbmtub3duIiwibXljbGFpbSI6WyJVc2VyIl0sImV4cCI6MTYyMzU5MzQxM30.t28M7A9UnDxOhFGlFlsIgHFTgRgCEe6t8h7neFqGjYI";
	        String adminToken="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbkBleGFtcGxlLmNvbSIsInVpZCI6IjEiLCJhZGRyZXNzIjoiVW5rbm93biIsIm15Y2xhaW0iOlsiQWRtaW4iXSwiZXhwIjoxNjIzNTkzNDEzfQ.w7AWJr25UuLyvh049mKkzVI2Ijks1ODqfYu_9_lnw4Y";
	        String forToken= "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwidWlkIjoiMSIsImFkZHJlc3MiOiJVbmtub3duIiwibXljbGFpbSI6WyJleGNlcHRpb24iXSwiZXhwIjoxNjIzNTkzNDEzfQ.gJhzXb-9YYWrChwIuPsresbVBhWBKEN4PwyCbEiGLbE";
	        // Mock DecodedJWT
	        DecodedJWT decodedJWT = JWT.decode(token.substring(7)); 

	        when(userService.isNewUser(decodedJWT.getClaim("uid").asString())).thenReturn(true);

	        mockMvc.perform(get("/api/users/login")
	                .header("Authorization", token)
	                .contentType(MediaType.APPLICATION_JSON))
	                .andExpect(status().isCreated()) 
	                .andExpect(jsonPath("$.userId").value(decodedJWT.getClaim("uid").asString()))
	                .andExpect(jsonPath("$.username").value("user"))
	                .andExpect(jsonPath("$.address").value("Unknown"))
	                .andExpect(jsonPath("$.email").value("user@example.com"))
	                .andExpect(jsonPath("$.message").value("New user created and logged in."));

	        when(userService.isNewUser(decodedJWT.getClaim("uid").asString())).thenReturn(false);

	        mockMvc.perform(get("/api/users/login")
	                .header("Authorization", token)
	                .contentType(MediaType.APPLICATION_JSON))
	                .andExpect(status().isOk()) 
	                .andExpect(jsonPath("$.userId").value(decodedJWT.getClaim("uid").asString()))
	                .andExpect(jsonPath("$.username").value("user"))
	                .andExpect(jsonPath("$.address").value("Unknown"))
	                .andExpect(jsonPath("$.email").value("user@example.com"))
	                .andExpect(jsonPath("$.message").value("Returning user logged in."));
	        mockMvc.perform(get("/api/users/login")
	        		.header("Authorization", adminToken)
	        		.contentType(MediaType.APPLICATION_JSON))
	        .andExpect(status().isOk()) 
	        .andExpect(jsonPath("$.userId").value(decodedJWT.getClaim("uid").asString()))
	        .andExpect(jsonPath("$.username").value("admin"))
	        .andExpect(jsonPath("$.address").value("Unknown"))
	        .andExpect(jsonPath("$.email").value("admin@example.com"))
	        .andExpect(jsonPath("$.message").value("Admin logged in."));

	        when(userService.isNewUser(decodedJWT.getClaim("uid").asString())).thenReturn(false);

	        mockMvc.perform(get("/api/users/login")
	                .header("Authorization", forToken)
	                .contentType(MediaType.APPLICATION_JSON))
	                .andExpect(status().isForbidden()); 
	       
	    }
	
	@Test
	@WithMockUser(authorities = "User")
	void testUpdateUser() throws Exception {
		String userId = "1";
		UserEntity updatedUserDetails = new UserEntity("1", "Tanish", "tansih@gmail.com", "kalyani nagar", "user",
				null);
		UserEntity updatedUser = new UserEntity("1", "Tanish", "tansih@gmail.com", "kalyani nagar", "user", null);

		Mockito.when(userService.updateUser(Mockito.eq(userId), Mockito.any(UserEntity.class))).thenReturn(updatedUser);

		mockMvc.perform(put("/api/users/update-user/{id}", userId).contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(updatedUserDetails)).with(csrf())).andExpect(status().isOk());
	}

	@Test
	@WithMockUser(authorities = "User")
	void testDeleteUser() throws Exception {
		Long userId = 1L;

		mockMvc.perform(delete("/api/users/delete-user/{id}", userId).with(csrf())).andExpect(status().isNoContent());
	}

}
