import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public onClickToggle(): void {
    let navWrapper = document.getElementsByClassName("nav__wrapper")[0];
    let navToggle = document.getElementsByClassName("nav__toggle")[0];
    if (navWrapper.classList.contains("active")) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "menu");
      navWrapper.classList.remove("active");
    } else {
      navWrapper.classList.add("active");
      navToggle.setAttribute("aria-label", "close menu");
      navToggle.setAttribute("aria-expanded", "true");
    }
  }

}
