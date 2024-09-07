package com.example.microservice.security.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.core.OAuth2AuthorizationException;

import feign.RequestInterceptor;
import feign.RequestTemplate;

@Configuration
@ComponentScan
public class FeignClientInterceptor implements RequestInterceptor {

	@Autowired
	private OAuth2AuthorizedClientManager  client;

	
	@Override
	public void apply(RequestTemplate template) {
		try {
			String token = client.authorize(OAuth2AuthorizeRequest.withClientRegistrationId("my-internal-client").principal("internal").build()).getAccessToken().getTokenValue();
			template.header("Authorization", "Bearer " + token);
		} catch (OAuth2AuthorizationException ex) {
			System.err.println("Error retrieving access token: " + ex.getMessage());
		}
	}

}
