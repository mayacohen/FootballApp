import { Component, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Client } from '../../services/client';
import { TeamInfo } from '../../models/team-info';

@Component({
  selector: 'app-main',
  imports: [CommonModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main implements OnInit, OnDestroy{
  notFan = "bi bi-star hover-star";
  fan = "bi bi-star-fill hover-star";
  teams: TeamInfo[] = [];
  constructor(private client:Client, private cdr:ChangeDetectorRef){}
  ngOnInit(): void {
    const prevData = localStorage.getItem("football-data");
    if (prevData === null)
      this.getDataFromApi();
    else
    {
      const data = JSON.parse(prevData);
      if (prevData.includes('image_path'))
        this.handleFootBallData(data.data,'denmark');
      else
        this.handleFootBallData(data,'england');
    }
  }
  getDataFromApi()
  {
    this.recoursiveGetLeague(100,"england");
    const data = localStorage.getItem("football-data");
    if (data === null)
      this.recoursiveGetLeague(100,"denmark");
  }
  recoursiveGetLeague(time:number, country:string)
  {
    if (time > 5000)
    {
      return;
    }
    if (country === 'england')
    {
      this.client.getDataFromUrl('england').subscribe({next: res =>
      {
        const data = res.response.slice(0, 30);
        this.handleFootBallData(data, country);
        localStorage.setItem("football-data",JSON.stringify(data));
        this.cdr.detectChanges();
      },
      error: () => {
         setTimeout(() => this.recoursiveGetLeague(time+100, country),time);
      }});
    }
    else
    {
      this.client.getDataFromSportsMonks().subscribe({next: res =>
      {
        this.handleFootBallData(res.data, country);
        localStorage.setItem("football-data",JSON.stringify(res));
        this.cdr.detectChanges();
      },
      error: () => {
         setTimeout(() => this.recoursiveGetLeague(time+100, country),time);
      }});
    }
  }
  handleFootBallData(data:any, country:string)
  {
    data.forEach((team:any) => {
          const name = (country==='england')? team.team.name : team.name;
          const starValue = 
          localStorage.getItem(name) === null ? this.notFan : this.fan;
          const newTeam : TeamInfo = {
            pic:(country==='england')? team.team.logo: team.image_path,
            name: name,
            foundedYear: (country==='england')? team.team.founded : team.founded,
            starClass:starValue
          };
          this.teams.push(newTeam);
         });
        console.log(data);
  }
  changeStar(teamName:string)
  {
    let team = this.teams.find(t => t.name===teamName);
    if (team === undefined)return;
    if (team.starClass === this.notFan)
    {
      team.starClass = this.fan;
      localStorage.setItem(team.name, "fan");
    }
    else 
    {
      localStorage.removeItem(team.name);
      team.starClass = this.notFan;
    }
    this.cdr.detectChanges();  
  }
  ngOnDestroy(): void {
    localStorage.clear();
  }
}
