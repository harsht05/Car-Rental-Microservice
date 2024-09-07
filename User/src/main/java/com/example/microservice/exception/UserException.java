package com.example.microservice.exception;

public class UserException extends RuntimeException {

	private String errorCode;

	public UserException(String message) {
		super(message);
	}

	public UserException(String message, String errorCode) {
		super(message);
		this.errorCode = errorCode;
	}

	public String getErrorCode() {
		return errorCode;
	}

}
