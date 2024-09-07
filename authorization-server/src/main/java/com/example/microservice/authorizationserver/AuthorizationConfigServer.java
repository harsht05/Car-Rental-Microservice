package com.example.microservice.authorizationserver;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.oauth2.server.authorization.client.InMemoryRegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;



@Configuration
public class AuthorizationConfigServer {
	
	 @Bean
	    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http) throws Exception {
	        OAuth2AuthorizationServerConfiguration.applyDefaultSecurity(http);

	        http
	            .getConfigurer(OAuth2AuthorizationServerConfigurer.class)
	            .oidc(oidc -> {});  

	        http
	            .exceptionHandling(exceptions -> exceptions
	                .authenticationEntryPoint(new LoginUrlAuthenticationEntryPoint("/login"))
	            )
	            .oauth2ResourceServer(oauth2 -> oauth2.jwt());

	        return http.build();
	    }

	    @Bean
	    public UserDetailsService userDetailsService() {
	        return new InMemoryUserDetailsManager(
	            User.withDefaultPasswordEncoder()
	                .username("user")
	                .password("password")
	                .roles("USER")
	                .build());
	    }

//	    @Bean
//	    public RegisteredClientRepository registeredClientRepository() {
//	        return new InMemoryRegisteredClientRepository(
//	            RegisteredClient.withId("client-id")
//	                .clientId("client-id")
//	                .clientSecret("client-secret")
//	                .clientName("Your Client Name")
//	                .redirectUri("http://localhost:8080/login/oauth2/code/custom")
//	                .scope("read")
//	                .authorizationGrantType("authorization_code")
//	                .build()
//	        );
//	    }
	    @Bean
	    public AuthorizationServerSettings authorizationServerSettings() {
	        return AuthorizationServerSettings.builder()
	            .issuer("http://localhost:9000")
	            .build();
	    }

}
