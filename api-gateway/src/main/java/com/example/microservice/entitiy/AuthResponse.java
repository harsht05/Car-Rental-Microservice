package com.example.microservice.entitiy;

import java.util.Collection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

	private String userId;
	private String accessToken;
	private String refreshToken;
	private Long expireAt;
	
	private Collection<String> authorities;
}
