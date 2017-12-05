"use strict";

class App {
  constructor() {
    const router = document.querySelector("sc-router");
    const links = Array.from(document.querySelectorAll("a"));

    function onClick(evt) {
      evt.preventDefault();
      router.go(evt.target.href);
    }
    links.forEach(link => {
      link.addEventListener("click", onClick);
    });
  }
}

new App();
