package com.example.microservice.security.interceptor;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;


public class RestTemplateInterceptor implements ClientHttpRequestInterceptor {

	@Autowired
	private OAuth2AuthorizedClientManager auth2AuthorizedClientManager;

    private Logger logger = LoggerFactory.getLogger(RestTemplateInterceptor.class);

	
	public RestTemplateInterceptor(OAuth2AuthorizedClientManager auth2AuthorizedClientManager) {
		super();
		this.auth2AuthorizedClientManager = auth2AuthorizedClientManager;
	}

	 @Override
	    public ClientHttpResponse intercept(HttpRequest request, byte[] body, ClientHttpRequestExecution execution) throws IOException {
	        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest.withClientRegistrationId("my-internal-client")
	                                                                        .principal("internal")
	                                                                        .build();
	        String token = auth2AuthorizedClientManager.authorize(authorizeRequest).getAccessToken().getTokenValue();

	        request.getHeaders().add("Authorization", "Bearer " + token);
	        logger.debug("Token obtained: {}", token);
	        logger.debug("Request URI: {}", request.getURI());
	        logger.debug("Request Headers: {}", request.getHeaders());

	        ClientHttpResponse response = execution.execute(request, body);
	        logger.debug("Response Status Code: {}", response.getStatusCode());
	        logger.debug("Response Headers: {}", response.getHeaders());

	        return response;
	    }

}
