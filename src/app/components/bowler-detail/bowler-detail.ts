import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink ,Router, Route } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Scouting } from '../../services/scouting';
import { Bowler } from '../../models/bowler';
import { map, switchMap } from 'rxjs/operators';
import {  Observable } from 'rxjs';
import { ReactiveFormsModule ,FormBuilder,FormGroup,Validators } from '@angular/forms';
@Component({
  selector: 'app-bowler-detail',
  imports: [CommonModule,RouterLink,ReactiveFormsModule],
  templateUrl: './bowler-detail.html',
  styleUrl: './bowler-detail.css',
})
export class BowlerDetail implements OnInit {
  bowler$: Observable<Bowler | undefined> | undefined;
  bowlerData : Bowler | undefined;

  editMode = false;
  editForm!: FormGroup

  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private scoutingService :Scouting,
    private fb : FormBuilder
  ){}

  ngOnInit(): void {
      this.bowler$ = this.route.paramMap.pipe(
        map(params => Number(params.get('id'))),
        map (id =>{
        const bowler = this.scoutingService.getBowlers().find(b=> b.id === id);

        this.bowlerData = bowler;
        if (bowler) {this.initForm(bowler);}
        return bowler;
  })
      )
  }

  initForm(bowler: Bowler) {
    this.editForm = this.fb.group({
      name : [bowler.name,[Validators.required]],
      status : [bowler.status,[Validators.required]],
      topSpeed : [bowler.topSpeed,[Validators.required,Validators.min(1)]],
      avgSpeed : [bowler.avgSpeed],
      oversBowled : [bowler.oversBowled],
      specialty : [bowler.specialty]
    })
  }


  toggleEditMode() {
    this.editMode = !this.editMode;

    if (this.editMode && this.bowlerData){ this.initForm(this.bowlerData)}
  }

  saveChanges(){
    if (this.editForm.valid && this.bowlerData) {
      const  updateBowler : Bowler = {...this.bowlerData,...this.editForm.value};

      this.scoutingService.updateBowler(updateBowler);
      this.bowlerData = updateBowler;
      this.editMode = false;
    }
  }

  removeBowler(id : number | undefined){
    if (id) {
      this.scoutingService.deleteBowler(id);
      this.router.navigate(['/dashboard']);
    }
  }

}
