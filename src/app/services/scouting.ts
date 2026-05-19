import { Injectable } from '@angular/core';
import { Bowler } from '../models/bowler';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Added HttpHeaders

@Injectable({
  providedIn: 'root',
})
export class Scouting {
  
  private apiUrl = 'http://localhost:5167/api/Bowlers';

  private bowlersSubject = new BehaviorSubject<Bowler[]>([]);
  bowlers$ = this.bowlersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadBowlers();
  }

  private getAuthOptions() {
    const token = localStorage.getItem('scout_token');
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
  }

  loadBowlers(){
    // Passed getAuthOptions() into the request
    this.http.get<Bowler[]>(this.apiUrl, this.getAuthOptions()).subscribe(data => {
      this.bowlersSubject.next(data);
    });
  }

  getBowlers(): Bowler[] {
    return this.bowlersSubject.value;
  }

  addBowler(newBowler: Omit< Bowler,'id'>) {
    this.http.post<Bowler>(this.apiUrl, newBowler, this.getAuthOptions()).subscribe(savedBowler =>{
      const current = this.bowlersSubject.value;
      this.bowlersSubject.next([...current,savedBowler]);
    });
  }

  toggleStatus(id: number): void {
    const current = this.bowlersSubject.value;
    const bowlerToUpdate = current.find(b => b.id === id);

    if (bowlerToUpdate) {
      const nextStatus = (bowlerToUpdate.status === 'Active' ? 'Injured' : bowlerToUpdate.status === 'Injured' ? 'Recovering' : 'Active') as 'Active' | 'Injured' | 'Recovering';      
      const updatedBowler = { ...bowlerToUpdate, status: nextStatus };

      this.updateBowler(updatedBowler); 
    }
  }

  updateBowler(updatedBowler: Bowler) {
    this.http.put(`${this.apiUrl}/${updatedBowler.id}`, updatedBowler, this.getAuthOptions()).subscribe(() => {
      const current = this.bowlersSubject.value;
      const updatedList = current.map(b => b.id === updatedBowler.id ? updatedBowler : b);
      this.bowlersSubject.next(updatedList);
    });
  }

  deleteBowler(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`, this.getAuthOptions()).subscribe(() => {
      const current = this.bowlersSubject.value;
      const updatedList = current.filter(b => b.id !== id);
      this.bowlersSubject.next(updatedList);
    });
  }

  getInjuryHistory(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/history`, this.getAuthOptions());
  }

   getSpeedHistory(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/speed-history`, this.getAuthOptions());
  }
}