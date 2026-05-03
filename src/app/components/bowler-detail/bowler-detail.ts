import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Scouting } from '../../services/scouting';
import { Bowler } from '../../models/bowler';
import { map, switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
@Component({
  selector: 'app-bowler-detail',
  imports: [CommonModule,RouterLink],
  templateUrl: './bowler-detail.html',
  styleUrl: './bowler-detail.css',
})
export class BowlerDetail implements OnInit {
  bowler$: Observable<Bowler | undefined> | undefined;

  constructor(
    private route:ActivatedRoute,
    private scoutingService :Scouting
  ){}

  ngOnInit(): void {
      this.bowler$ = this.route.paramMap.pipe(
        map(params => Number(params.get('id'))),

        switchMap(id=> this.scoutingService.bowlers$.pipe(

          map(bowlers => bowlers.find(b => b.id === id))
        ))

      )
  }

}
