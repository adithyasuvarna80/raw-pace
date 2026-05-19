import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 1. Added ChangeDetectorRef
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Scouting } from '../../services/scouting';
import { Bowler } from '../../models/bowler';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartConfiguration, ChartOptions } from 'chart.js'; 
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-bowler-detail',
  imports: [CommonModule, RouterLink, ReactiveFormsModule,BaseChartDirective],
  templateUrl: './bowler-detail.html',
  styleUrl: './bowler-detail.css',
})
export class BowlerDetail implements OnInit {
  bowler$: Observable<Bowler | undefined> | undefined;
  bowlerData: Bowler | undefined;
  injuryHistory: any[] = []; 
  editMode = false;
  editForm!: FormGroup;

   public chartReady = false;
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [], // X-Axis (Dates)
    datasets: [
      {
        data: [], // Y-Axis (Speeds)
        label: 'Top Speed (km/h)',
        fill: true,
        tension: 0.4,
        borderColor: '#ff4500',
        backgroundColor: 'rgba(255, 69, 0, 0.3)'
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = { responsive: true };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scoutingService: Scouting,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.scoutingService.loadBowlers();

    this.bowler$ = this.route.paramMap.pipe(
      map(params => Number(params.get('id'))),
      switchMap(id => this.scoutingService.bowlers$.pipe(
        map(bowlers => bowlers.find(b => b.id === id))
      ))
    );

    this.bowler$.subscribe(bowler => {
      if (bowler) {
        this.bowlerData = bowler;
        this.initForm(bowler);
        
        this.scoutingService.getInjuryHistory(bowler.id).subscribe({
          next: (history) => {
            this.injuryHistory = history;
            
            this.cdr.detectChanges(); 
          },


          error: (err) => console.error("Failed to fetch history", err)
        });

          this.scoutingService.getSpeedHistory(bowler.id).subscribe({
          next: (speeds) => {
  
            this.lineChartData = {
              ...this.lineChartData,
              labels: speeds.map((s: any) => new Date(s.dateRecorded).toLocaleString()),
              datasets: [
                {
                  ...this.lineChartData.datasets[0],
                  data: speeds.map((s: any) => s.topSpeed)
                }
              ]
            };
            
            this.chartReady = true;
            this.cdr.detectChanges(); 
          },
          error: (err) => console.error("Failed to fetch speeds", err)
        });
      }
    });

  }

  initForm(bowler: Bowler) {
    this.editForm = this.fb.group({
      name: [bowler.name, [Validators.required]],
      status: [bowler.status, [Validators.required]],
      topSpeed: [bowler.topSpeed, [Validators.required, Validators.min(1)]],
      avgSpeed: [bowler.avgSpeed],
      oversBowled: [bowler.oversBowled],
      specialty: [bowler.specialty]
    });
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode && this.bowlerData) { this.initForm(this.bowlerData); }
  }

  saveChanges() {
    if (this.editForm.valid && this.bowlerData) {
      const updateBowler: Bowler = { ...this.bowlerData, ...this.editForm.value };
      this.scoutingService.updateBowler(updateBowler);
      this.editMode = false;
    }
  }

  removeBowler(id: number | undefined) {
    if (id) {
      this.scoutingService.deleteBowler(id);
      this.router.navigate(['/dashboard']);
    }
  }
}