"use strict";

class SCRouter extends HTMLElement {
  createdCallback() {
    this._onChanged = this._onChanged.bind(this);
    this._routes = new Map();
  }

  _onChanged() {
    const path = window.location.pathname;
    const routes = Array.from(this._routes.keys());
    const route = routes.find(r => r.test(path));
    const data = route.exec(path);

    if (!route) {
      return;
    }

    this._newView = this._routes.get(route);

    if (this._animating) {
      return Promise.resolve();
    }

    this._animating = true;
    let outViewPromise = Promise.resolve();

    if (this._currentView) {
      outViewPromise = this._currentView.out(data);
    }

    return outViewPromise
      .then(_ => {
        this._currentView = this._newView;
        this._animating = false;
      })
      .then(_ => this._newView.in(data));
  }

  go(url) {
    window.history.pushState(null, null, url);
    return this._onChanged();
  }

  _clearRoutes() {
    this._routes.clear();
  }

  _createRoute(route, view) {
    if (this._routes.has(route))
      return console.warn(`Route already exists: ${route}`);

    this._routes.set(route, view);
  }

  _createRoutes() {
    for (let view of document.querySelectorAll("sc-view")) {
      if (!view.route) continue;

      this._createRoute(new RegExp(view.route, "i"), view);
    }
  }

  attachedCallback() {
    window.addEventListener("popstate", this._onChanged);
    this._clearRoutes();
    this._createRoutes();
    this._onChanged();
  }

  detachedCallback() {
    window.removeEventListener("popstate", this._onChanged);
  }
}

document.registerElement("sc-router", SCRouter);
