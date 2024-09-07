package com.example.microservice.exception;

public class CarException extends RuntimeException{

	public CarException(String message) {
        super(message);
    }
 public CarException(String message, String errorCode) {
        super(message);
        errorCode= this.getErrorCode() ;
    }

    public String getErrorCode() {
        return getErrorCode();
    }
}
