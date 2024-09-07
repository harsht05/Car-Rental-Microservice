package com.example.microservice;


import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.LocalTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

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
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import com.example.microservice.controller.BookingController;
import com.example.microservice.entity.BookingEntity;
import com.example.microservice.repository.BookingRepository;
import com.example.microservice.service.BookingService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(BookingController.class)
@ExtendWith(MockitoExtension.class)
public class BookingControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BookingService bookingService;

    @MockBean
    private BookingRepository bookingRepository;
    
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
    void testGetAllBookings() throws Exception {
        Date date1 = new Date();
        Date date2 = new Date();
        
        LocalTime time1 = LocalTime.of(10, 0); 
        LocalTime time2 = LocalTime.of(15, 0); 
        
        BookingEntity booking1 = new BookingEntity(1L, "1L", 1L, 10000, date1, date2, "", "", time1, time2, false);
        BookingEntity booking2 = new BookingEntity(2L, "2L", 2L, 15000, date1, date2, "", "", time1, time2, false);

        Mockito.when(bookingService.getAllBookings()).thenReturn(Arrays.asList(booking1, booking2));

        mockMvc.perform(get("/api/bookings/get-all-bookings"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(Arrays.asList(booking1, booking2))));
    }

    @Test
    @WithMockUser(authorities = "User")
    void testGetCarById() throws Exception {
        Date date1 = new Date();
        Date date2 = new Date();
        LocalTime time1 = LocalTime.of(10, 0); 
        LocalTime time2 = LocalTime.of(15, 0);
        Optional<BookingEntity> booking = Optional.of(new BookingEntity(1L, "1L", 1L, 10000, date1, date2,"","",time1,time2,false));

        Mockito.when(bookingService.getBookingById(1L)).thenReturn(booking);

        mockMvc.perform(get("/api/bookings/get-single-booking/1"))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(booking)));
    }
    
    @Test
    @WithMockUser(authorities = "User")
    void testCreateBooking() throws Exception {
    	 Date date1 = new Date();
         Date date2 = new Date();
         LocalTime time1 = LocalTime.of(10, 0); 
         LocalTime time2 = LocalTime.of(15, 0);
         BookingEntity newBooking = new BookingEntity(1L, "1L", 1L, 10000, date1, date2,"","",time1,time2,false);
        BookingEntity savedBooking = new BookingEntity(1L, "1L", 1L, 10000, date1, date2,"","",time1,time2,false);

        Mockito.when(bookingService.createBooking(Mockito.any(BookingEntity.class))).thenReturn(savedBooking);

        mockMvc.perform(post("/api/bookings/save-booking")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newBooking))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(savedBooking)));
    }
    
    @Test
    @WithMockUser(authorities = "User")
    void testUpdateBooking() throws Exception {
        Long bookingId = 1L;
        Date date1 = new Date();
        Date date2 = new Date();
        LocalTime time1 = LocalTime.of(10, 0); 
        LocalTime time2 = LocalTime.of(15, 0);
        BookingEntity updatedBookingDetails = new BookingEntity(1L, "1L", 1L, 10000, date1, date2,"","",time1,time2,false);
        BookingEntity updatedBooking = new BookingEntity(1L, "1L", 1L, 10000, date1, date2,"","",time1,time2,false);

        Mockito.when(bookingService.updateBooking(Mockito.eq(bookingId), Mockito.any(BookingEntity.class))).thenReturn(updatedBooking);

        mockMvc.perform(put("/api/bookings/update-booking/{id}", bookingId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updatedBookingDetails))
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().json(objectMapper.writeValueAsString(updatedBooking)));
    }
    
    @Test
    @WithMockUser(authorities = "User")
    void testDeleteBooking() throws Exception {
        Long bookingId = 1L;
        Boolean blockValue = true; 

        mockMvc.perform(put("/api/bookings/cancel-booking/{id}", bookingId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(blockValue.toString())
                .with(csrf()))
                .andExpect(status().isNoContent())
                .andDo(MockMvcResultHandlers.print());

        verify(bookingService).deleteBooking(eq(bookingId), eq(blockValue));
    }

	/*
	 * @Test
	 * 
	 * @WithMockUser(authorities="Admin") void testGetBookingsByCarId() { // Mock
	 * data Long carId = 1L; BookingEntity booking1 = new BookingEntity(1L, "1L",
	 * 1L, 10000, null, null, "", "", false); BookingEntity booking2 = new
	 * BookingEntity(2L, "2L", 1L, 15000, null, null, "", "", false);
	 * List<BookingEntity> bookings = Arrays.asList(booking1, booking2);
	 * 
	 * // Mock repository method
	 * Mockito.when(bookingRepository.findByCarId(anyLong())).thenReturn(bookings);
	 * 
	 * // Call service method List<BookingEntity> result =
	 * bookingService.getBookingsByCarId(carId);
	 * 
	 * // Verify results assertEquals(2, result.size()); assertEquals(1L,
	 * result.get(0).getBookingId()); assertEquals(2L,
	 * result.get(1).getBookingId()); }
	 * 
	 * @Test
	 * 
	 * @WithMockUser(authorities = "User") void testGetBookingsByUserId() { // Mock
	 * data String userId = "user1"; BookingEntity booking1 = new BookingEntity(1L,
	 * "1L", 1L, 10000, null, null, "", "", false); BookingEntity booking2 = new
	 * BookingEntity(2L, "2L", 1L, 15000, null, null, "", "", false);
	 * List<BookingEntity> bookings = Arrays.asList(booking1, booking2);
	 * 
	 * // Mock repository method
	 * Mockito.when(bookingRepository.findByUserId(anyString())).thenReturn(bookings
	 * );
	 * 
	 * // Call service method List<BookingEntity> result =
	 * bookingService.getBookingsByUserId(userId);
	 * 
	 * // Verify results assertEquals(2, result.size()); assertEquals(1L,
	 * result.get(0).getBookingId()); assertEquals(2L,
	 * result.get(1).getBookingId()); }
	 */
}
