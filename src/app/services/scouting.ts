import { Injectable } from '@angular/core';
import { Bowler } from '../models/bowler';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Scouting {
  
  private bowlers : Bowler[] = [
    { id: 1, name: 'Mayank Yadav', topSpeed: 156.7, avgSpeed: 148.5, status: 'Injured', oversBowled: 12.1, specialty: 'Pure Pace' },
    { id: 2, name: 'Umran Malik', topSpeed: 157.0, avgSpeed: 145.2, status: 'Active', oversBowled: 45.0, specialty: 'Hit the deck' },
    { id: 3, name: 'Mohsin Khan', topSpeed: 151.0, avgSpeed: 140.8, status: 'Recovering', oversBowled: 28.4, specialty: 'Left-arm Angle' }
  ]

  private bowlersSubject = new BehaviorSubject<Bowler[]>(this.bowlers);

  bowlers$ = this.bowlersSubject.asObservable();

  addBowler(newBowler: Bowler) {
    this.bowlers = [...this.bowlers,newBowler];
    this.bowlersSubject.next(this.bowlers);
  }

  constructor() {}

  getBowlers():Bowler[] {
    return this.bowlers;
  }

  toggleStatus(id: number): void {
    this.bowlers = this.bowlers.map( b => {
      if (b.id === id ){
        const nextStatus = b.status === 'Active' ? 'Injured' : b.status === 'Injured' ? 'Recovering':'Active'; 
        return {...b,status:nextStatus}
      }
      return b;

    } );

    this.bowlersSubject.next(this.bowlers)
}


}