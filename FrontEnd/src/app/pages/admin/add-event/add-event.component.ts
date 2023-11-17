import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ievent } from 'src/app/models/ievent';
import { AdminService } from '../admin.service';
import { Icategory } from 'src/app/models/icategory';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent {
  eventForm!:FormGroup
  errorMessage:string = ""
  event!:Ievent
  categories!:Icategory[]
  coverData!: string
  imgData!: string
  backgroundData!: string

  constructor(private fb:FormBuilder, private adminSvc:AdminService){}

  ngOnInit(){
     this.adminSvc.GetCategories().subscribe(response => {
      this.categories = response
    })
    this.eventForm = this.fb.group({
      Name:this.fb.control(null, [Validators.required]),
      Description:this.fb.control(null, [Validators.required]),
      IdCategory:this.fb.control(null, [Validators.required]),
      Place:this.fb.control(null, [Validators.required]),
      StartDate:this.fb.control(null, [Validators.required]),
      EndDate:this.fb.control(null, [Validators.required]),
      Link:this.fb.control(null, [Validators.required]),
      Cover:this.fb.control(null, [Validators.required]),
      Img:this.fb.control(null, [Validators.required]),
      BackGround:this.fb.control(null, [Validators.required]),
      Free:this.fb.control(null, [Validators.required]),
      TicketPrice:this.fb.control(null, [Validators.required])
    })
    }

    Add(){
      this.event = {
        IdEvent:0,
        Name:this.eventForm.value.Name,
        Description:this.eventForm.value.Description,
        IdCategory:this.eventForm.value.IdCategory,
        Place:this.eventForm.value.Place,
        StartDate:this.eventForm.value.StartDate,
        EndDate:this.eventForm.value.EndDate,
        Link:this.eventForm.value.Link,
        Cover:this.coverData,
        Img:this.imgData,
        BackGround:this.backgroundData,
        Free:this.eventForm.value.Free,
        TicketPrice:this.eventForm.value.TicketPrice,
      }
      this.adminSvc.AddEvent(this.event)
      console.log(this.event);
      console.log(this.eventForm.value);


      this.eventForm.reset()
    }

    onFileSelected(event: any, fieldName: string) {
      console.log(fieldName);

      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const binaryData = new Uint8Array(reader.result as ArrayBuffer); // Dati binari effettivi
          if (fieldName === 'Cover') {
            this.coverData = this.arrayBufferToBase64(binaryData);
            console.log(this.coverData);
          } else if (fieldName === 'Img') {
            this.imgData = this.arrayBufferToBase64(binaryData);
          } else if (fieldName === 'BackGround') {
            this.backgroundData = this.arrayBufferToBase64(binaryData);
          }
        };
        reader.readAsArrayBuffer(file); // Converti il file in dati binari
        console.log(file);

      }
    }

    arrayBufferToBase64(arrayBuffer: Uint8Array): string {
      let binary = '';
      const bytes = new Uint8Array(arrayBuffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    }

}
