"use strict";

class SCView extends HTMLElement {
  get route() {
    return this.getAttribute("route") || null;
  }

  _hideSpinner() {
    this.classList.remove("pending");
  }
  _showSpinner() {
    this.classList.add("pending");
  }

  _loadView(data) {
    this._spinnerTimeout = setTimeout(_ => this._showSpinner(), 500);
    this._view = new DocumentFragment();

    const xhr = new XMLHttpRequest();
    xhr.onload = evt => {
      const newDoc = evt.target.response;
      const newView = newDoc.querySelector("sc-view.visible");

      newView.childNodes.forEach(node => {
        this._view.appendChild(node);
      });

      this.appendChild(this._view);
      clearTimeout(this._spinnerTimeout);
      this._hideSpinner();
    };
    xhr.responseType = "document";
    xhr.open("GET", data[0]);
    xhr.send();
  }

  in(data) {
    if (this._isRemote && !this._view) {
      this._loadView(data);
    }

    return new Promise((resolve, reject) => {
      const onTransitionEnd = () => {
        this.removeEventListener("transitionend", onTransitionEnd);
        resolve();
      };
      this.classList.add("visible");
      this.addEventListener("transitionend", onTransitionEnd);
    });
  }

  out() {
    return new Promise((resolve, reject) => {
      const onTransitionEnd = () => {
        this.removeEventListener("transitionend", onTransitionEnd);
        resolve();
      };
      this.classList.remove("visible");
      this.addEventListener("transitionend", onTransitionEnd);
    });
  }

  createdCallback() {
    this._spinnerTimeout = undefined;
    this._view = null;
    this._isRemote = this.getAttribute("remote") !== null;
  }
}

document.registerElement("sc-view", SCView);
