import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Scouting } from '../../services/scouting';
import { Bowler } from '../../models/bowler';
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms'; 
import { FormsModule } from '@angular/forms';
import { Observable,BehaviorSubject,combineLatest } from 'rxjs';
import { map,startWith } from 'rxjs';
import { Router,RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  bowlers$: Observable<Bowler[]>;
  bowlerForm :FormGroup;
  private searchSubject = new BehaviorSubject<string>('');
  filteredBowlers$!: Observable<Bowler[]>;


  constructor (private scoutingService : Scouting,private fb : FormBuilder , private authService: AuthService, private router: Router,){
    this.bowlerForm = this.fb.group({
      name:['',Validators.required],
      topSpeed: [0,[Validators.required,Validators.min(100)]],
      specialty : ['',Validators.required]
      
    });
    this.bowlers$ = this.scoutingService.bowlers$;

    this.filteredBowlers$ = combineLatest([
      this.scoutingService.bowlers$,
      this.searchSubject.pipe(startWith(''))
    ]).pipe(
      map(([bowlers,term])=> {
        return bowlers.filter((player:Bowler) =>
          player.name.toLowerCase().includes(term.toLowerCase())||
          player.specialty.toLowerCase().includes(term.toLowerCase())
        );
      })
    );
  }

  onsearchChange(value :string){
    this.searchSubject.next(value);
  }
  ngOnInit(): void {
     this.scoutingService.loadBowlers();
    
    this.filteredBowlers$ = combineLatest([
      this.scoutingService.bowlers$,
      this.searchSubject.pipe(startWith(''))
    ]).pipe(
      map(([bowlers, searchTerm]) => {
        if (!searchTerm) return bowlers;
        const term = searchTerm.toLowerCase();
        return bowlers.filter(b => 
          b.name.toLowerCase().includes(term) || 
          b.specialty.toLowerCase().includes(term)
        );
      })
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  changeStatus(id:number):void {
    this.scoutingService.toggleStatus(id);

    
  }

  onSubmit():void {
    if (this.bowlerForm.valid) {
      const newBowler :Omit <Bowler,'id'> ={
        
        name: this.bowlerForm.value.name,
        topSpeed: this.bowlerForm.value.topSpeed,
        avgSpeed: this.bowlerForm.value.topSpeed - 5, // Just a mock calculation
        status: 'Active'as const,
        oversBowled: 0,
        specialty: this.bowlerForm.value.specialty
      }
      

      this.scoutingService.addBowler(newBowler);
      
      this.bowlerForm.reset();

    }
    else {
      console.log("Form is invalid!")
    }


  }
  //get filteredBowlers(): Bowler[] {
 //   return this.bowlers$.filter((player : Bowler) => player.name.toLowerCase().includes(this.searchText.toLowerCase())|| player.specialty.toLowerCase().includes(this.searchText.toLowerCase()));
  //}

}
