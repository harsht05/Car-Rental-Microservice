package com.example.microservice.entitiy;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserEntity {
	    @Id
	    private String userId;
	    private String username;
	    private String address;
	    private String email;
	    private String roles; 

	    
	    
	    @Transient
	    
	    private List<Booking> booking= new ArrayList<>();


}


