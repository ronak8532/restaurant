import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestaurantsService } from '../service/restaurants.service';

@Component({
  selector: 'app-booking-order',
  templateUrl: './booking-order.component.html',
  styleUrls: ['./booking-order.component.css'],
  providers: [RestaurantsService]
})
export class BookingOrderComponent implements OnInit {
  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  stepFour: boolean = false;
  stepOneDetail: boolean = true;
  stepTwoDetail: boolean = false;
  stepThreeDetail: boolean = false;
  stepFourDetail: boolean = false;
  dishes: any ;
  orderForm: FormGroup;
  dishesForm: FormGroup;
  maxLength:boolean = false;
  meals = ["breakfast","lunch", "dinner"];
  availableRestaurant = [];
  availableDishes =  [];
  orderDetails: any;
  dishDetails: any;

  constructor(private resturantService: RestaurantsService, private formBuilder: FormBuilder,) {
  }

  ngOnInit() {
    this.getAllResturants();
    this.initOrderForm();
    this.addDishesForm();
    this.dishesForm = this.formBuilder.group({
     dishes: this.formBuilder.array([this.addDishesForm()])
    })
  }

  get dishControl(): FormArray {
    return this.dishesForm.get('dishes') as FormArray;
  }

  getAllResturants() {
    this.resturantService.getRestaurants().subscribe((res) => {
      if(res) {
        this.dishes = res.dishes;
      }
    })
  }

  initOrderForm() {
    this.orderForm = this.formBuilder.group({
      meal: ["", [Validators.required]],
      noOfPeople: ["", [Validators.required, Validators.maxLength(10)]],
      restaurantName: ["", [Validators.required]]
    });
  }

  addDishesForm()  {
    return this.formBuilder.group({
      dish: ["", [Validators.required]],
      noOfServing: ["", [Validators.required]]
    })
  }

  addDishes() {
    this.dishControl.push(this.addDishesForm());
  }

  deleteDishes(i) {
    this.dishControl.removeAt(i);
  }

  step2() {
   if(this.orderForm.value.noOfPeople > 10) {
     this.maxLength = true;
     return;
   } else {
     this.maxLength = false;
     this.stepTwo = true;
     this.stepTwoDetail = true;
     this.stepOne = false;
     this.stepOneDetail = false;
     this.availableRestaurant = [];
     this.dishes.forEach(element => {
       if(element.availableMeals.indexOf(this.orderForm.value.meal) !== -1) {
        this.availableRestaurant.push(element.restaurant);
       }
     });
     this.availableRestaurant = [...new Set(this.availableRestaurant)]
   }
  }

  previousStepOne() {
   this.stepTwo = false;
   this.stepTwoDetail = false;
   this.stepOne = true;
   this.stepOneDetail = true;
  }

  previousStepTwo() {
    this.stepThree = false;
    this.stepThreeDetail = true;
    this.stepTwo = true;
    this.stepTwoDetail = true;
  }

  previousStepThree() {
    this.stepFour = false;
    this.stepFourDetail = false;
    this.stepThree = true;
    this.stepThreeDetail = true;
  }

  step3() {
    console.log(this.orderForm);
    if(!this.orderForm.value.restaurantName) {
      return;
    }
      this.stepTwo = false;
      this.stepTwoDetail = false;
      this.stepThree = true;
      this.stepThreeDetail = true;
      this.availableDishes = [];
      this.dishes.forEach(element => {
        if(element.restaurant.indexOf(this.orderForm.value.restaurantName) !== -1) {
         this.availableDishes.push(element.name);
        }
      });
      this.availableDishes = [...new Set(this.availableDishes)];
   }

   step4() {
     this.stepThree = false;
     this.stepThreeDetail = false;
     this.stepFour = true;
     this.stepFourDetail = true;
     this.orderDetails = this.orderForm.value;
     this.dishDetails = this.dishesForm.value.dishes;
   }

   submit() {
     let order = this.orderForm.value;
     order.dishes = this.dishesForm.value.dishes;
     console.log(order);
   }

}
