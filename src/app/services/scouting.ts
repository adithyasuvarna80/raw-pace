import { Injectable } from '@angular/core';
import { Bowler } from '../models/bowler';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Scouting {
  
  private apiUrl = 'http://localhost:5167/api/Bowlers';


  private bowlersSubject = new BehaviorSubject<Bowler[]>([])
  bowlers$ = this.bowlersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadBowlers();
  }

  loadBowlers(){
    this.http.get<Bowler[]>(this.apiUrl).subscribe(data => {
      this.bowlersSubject.next(data);
    })
  }
   getBowlers(): Bowler[] {
    return this.bowlersSubject.value;
  }

  addBowler(newBowler: Omit< Bowler,'id'>) {
    this.http.post<Bowler>(this.apiUrl,newBowler).subscribe(savedBowler =>{
      const current = this.bowlersSubject.value;
      this.bowlersSubject.next([...current,savedBowler])
    });
  }

  toggleStatus(id: number): void {
    const current = this.bowlersSubject.value;
    const bowlerToUpdate = current.find(b => b.id === id);

    if (bowlerToUpdate) {
const nextStatus = (bowlerToUpdate.status === 'Active' ? 'Injured' : bowlerToUpdate.status === 'Injured' ? 'Recovering' : 'Active') as 'Active' | 'Injured' | 'Recovering';      const updatedBowler = { ...bowlerToUpdate, status: nextStatus };

      this.http.put(`${this.apiUrl}/${id}`, updatedBowler).subscribe(() => {
        const updatedList = current.map(b => b.id === id ? updatedBowler : b);
        this.bowlersSubject.next(updatedList);
      });
    }
  }

   updateBowler(updatedBowler: Bowler) {
    this.http.put(`${this.apiUrl}/${updatedBowler.id}`, updatedBowler).subscribe(() => {
      const current = this.bowlersSubject.value;
      const updatedList = current.map(b => b.id === updatedBowler.id ? updatedBowler : b);
      this.bowlersSubject.next(updatedList);
    });
  }

  

  deleteBowler(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      const current = this.bowlersSubject.value;
      const updatedList = current.filter(b => b.id !== id);
      this.bowlersSubject.next(updatedList);
    });
  }
}