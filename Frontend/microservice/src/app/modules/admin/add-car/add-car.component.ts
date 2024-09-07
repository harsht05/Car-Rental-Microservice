import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarService } from '../../../services/car.service';
import { Car } from '../../../model/car';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-car',
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.css']
})
export class AddCarComponent {
  carForm: FormGroup;
  selectedFile: File | null = null; 

  constructor(
    private formBuilder: FormBuilder,
    private carService: CarService,
    private router: Router 
  ) {
    this.carForm = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      mileage: [0, Validators.required],
      price: [0, Validators.required],
      address: ['', Validators.required],
      capacity:[0,Validators.required],
      type:['',Validators.required],
      gear:['',Validators.required],
      carImg: ['']
    });
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
      this.carForm.patchValue({
        carImg: this.selectedFile.name 
      });
    }
  }
  

  saveCar(): void {
    if (this.carForm.valid) {
      const carData: Car = this.carForm.value;
  
      if (this.selectedFile) {
        carData.carImg = this.getCarImgPath(this.selectedFile.name);
      }
  
      this.carService.saveCar(carData).subscribe(
        (savedCar: Car) => {
          console.log('Car saved successfully:', savedCar);
          this.carForm.reset(); 
          this.router.navigate(['/admin']);
        },
        (error: HttpErrorResponse) => {
          console.error('Error saving car:', error);
        }
      );
    } else {
      console.error('Form is invalid.');
    }
  }
  

  private getCarImgPath(fullPath: string): string {
    const index = fullPath.lastIndexOf('/') + 1;
    return fullPath.substring(index); 
  }
}
