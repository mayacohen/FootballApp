import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class Client {
  footApi = 'https://v3.football.api-sports.io/';
  key = 'e52897f6ed7e32233a6baf7b53d3dc21';
  sportsMonks = "https://api.sportmonks.com/v3/football/teams/countries/320?api_token=WbpxJ1kph0t2pRmlYypRa6kP9FW7UkD2mvyYIJHDCxFRUWSSsZNpBLRZhf1f&include=country&select=id,name,founded,image_path&per_page=50";
  private http = inject(HttpClient);
  getDataFromUrl(country:string):Observable<any>
  {
    const url = `${this.footApi}teams?country=${country}`;
    const headers = new HttpHeaders({
      'x-apisports-key': this.key
    });
    return this.http.get<any>(url, {headers});
  }
  getDataFromSportsMonks():Observable<any>
  {
    const proxyUrl = 'https://api.allorigins.win/raw?url=';
    return this.http.get<any>(proxyUrl + this.sportsMonks);
  } 
}
