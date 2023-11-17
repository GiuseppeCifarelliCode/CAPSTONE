import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../admin.service';
import { Icategory } from 'src/app/models/icategory';
import { HomeService } from '../../home/home.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
  addCategoryForm!:FormGroup
  errorMessage:string = ""
  category:Icategory = {IdCategory: 0, Name: "" }
  categories!:Icategory[]

  constructor(private fb:FormBuilder, private adminSvc:AdminService, private homeSvc:HomeService){}

  ngOnInit(){
    this.addCategoryForm = this.fb.group({
      Name:this.fb.control(null, [Validators.required]),
    })
    this.homeSvc.GetCategory().subscribe(response =>
      this.categories = response)
  }

  Add(){
    if(this.addCategoryForm.value.Name != ""){
      this.category.Name = this.addCategoryForm.value.Name
      this.adminSvc.AddCategory(this.category)
      this.addCategoryForm.reset()
      this.errorMessage = ""
    } else this.errorMessage = "Inserisci una categoria!"
  }
}
