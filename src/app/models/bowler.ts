export interface Bowler {
    id : number;
    name :string;
    topSpeed : number;
    avgSpeed : number;
    status : 'Active' | 'Injured' | 'Recovering';
    oversBowled : number;
    specialty : string;
}
