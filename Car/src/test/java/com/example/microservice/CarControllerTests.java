package com.example.microservice;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
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

import com.example.microservice.controller.CarController;
import com.example.microservice.entity.CarEntity;
import com.example.microservice.service.CarService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(CarController.class)
@ExtendWith(MockitoExtension.class)
public class CarControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CarService carService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(springSecurity())
                .build();
    }



    @Test
    @WithMockUser(authorities = "Admin")
    void testGetAllCars() throws Exception {
        CarEntity car1 = new CarEntity(1L, "Creta", 25, 10000,4,"","","","kalyani nagar");
        CarEntity car2 = new CarEntity(2L, "Innova",25 ,15000,4,"","","pimpri","");

        Mockito.when(carService.getAllCars()).thenReturn(Arrays.asList(car1, car2));

        mockMvc.perform(get("/api/cars/get-all-cars"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(Arrays.asList(car1, car2))));
    }

    @Test
    @WithMockUser(authorities = "User")
    void testGetCarById() throws Exception {
        CarEntity car = new CarEntity(1L, "Creta", 25, 10000,4,"","","kalyani nagar","");

        Mockito.when(carService.getCarById(1L)).thenReturn(car);

        mockMvc.perform(get("/api/cars/get-single-car/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(car)));
    }

    @Test
    @WithMockUser(authorities = "Admin")
    void testCreateCar() throws Exception {
        CarEntity newCar = new CarEntity(null, "New Car", 30, 20000, 4,"","","Test Location","");
        CarEntity savedCar = new CarEntity(1L, "New Car", 30, 20000,4, "","","Test Location","");

        Mockito.when(carService.createCar(Mockito.any(CarEntity.class))).thenReturn(savedCar);

        mockMvc.perform(post("/api/cars/save-car")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newCar))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(savedCar)));
    }
    
    @Test
    @WithMockUser(authorities = "Admin")
    void testUpdateCar() throws Exception {
        Long carId = 1L;
        CarEntity updatedCarDetails = new CarEntity(carId, "Updated Car", 35, 25000,4,"","", "Updated Location","");
        CarEntity updatedCar = new CarEntity(carId, "Updated Car", 35, 25000, 4,"","","Updated Location","");

        Mockito.when(carService.updateCar(Mockito.eq(carId), Mockito.any(CarEntity.class))).thenReturn(updatedCar);

        mockMvc.perform(put("/api/cars/update-car/{id}", carId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedCarDetails))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(updatedCar)));
    }
    @Test
    @WithMockUser(authorities = "Admin")
    void testDeleteCar() throws Exception {
        Long carId = 1L;

        Mockito.when(carService.deleteCar(carId)).thenReturn(true);

        mockMvc.perform(delete("/api/cars/delete-car/{id}", carId)
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Successfully deleted car with ID: " + carId));
    }
}
