import { HttpClient } from '@angular/common/http';
import { Subject, fromEvent } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
} from 'rxjs/operators';
import { Component, ElementRef, VERSION, ViewChild } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  filterTextChanged: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  @ViewChild('f', { static: true }) inputElem: ElementRef;
  ngOnInit() {
    fromEvent(this.inputElem.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        // if character length greater then 2
        filter((res) => res.length > 2),

        // Time in milliseconds between key events
        debounceTime(1000),

        // If previous query is diffent from current
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        this.loadPokemon(text);
      });
  }

  loadPokemon(text: string) {
    this.http
      .get<any>(`https://pokeapi.co/api/v2/pokemon/${text}`)
      .subscribe((data: any) => {
        console.log(data);
      });
  }
}
