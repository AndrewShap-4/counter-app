import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";

export class counterApp extends DDDSuper(LitElement) {

  static get tag() {
    return "counter-app";
  }

  constructor() {
    super();
    this.title = "";
    this.count = 0;
    this.min = -25;
    this.max = 25;
  }

  static get properties() {
    return {
      title: { type: String },
      count: { type: Number},
      min: { type: Number},
      max: { type: Number},
    };
  }

  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
        font-size: var(--counter-app-font-size, var(--ddd-font-size-s));
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      .counter {
        font-size: 66px; 
        margin-bottom: 16px; 
      }
      button {
        padding: 16px;
        font-size: 20px; 
        margin: 4px; 
      }
      button:hover {
        background-color: lightgreen; 
      }
      button:focus {
        background: blue;
      }
      div {
        padding: 0;
        margin: 0;
      }

    `];
  }

  increment(e) {
    if (this.count < this.max) { 
      this.count++;
      this.updateColor();
    }
  }

  decrement(e) {
    if (this.count > this.min) { 
      this.count--;
      this.updateColor(); 
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('counter')) {
      // do your testing of the value and make it rain by calling makeItRain
    }
  }
  
  makeItRain() {
    // this is called a dynamic import. It means it won't import the code for confetti until this method is called
    // the .then() syntax after is because dynamic imports return a Promise object. Meaning the then() code
    // will only run AFTER the code is imported and available to us
    import("@haxtheweb/multiple-choice/lib/confetti-container.js").then(
      (module) => {
        // This is a minor timing 'hack'. We know the code library above will import prior to this running
        // The "set timeout 0" means "wait 1 microtask and run it on the next cycle.
        // this "hack" ensures the element has had time to process in the DOM so that when we set popped
        // it's listening for changes so it can react
        setTimeout(() => {
          // forcibly set the poppped attribute on something with id confetti
          // while I've said in general NOT to do this, the confetti container element will reset this
          // after the animation runs so it's a simple way to generate the effect over and over again
          this.shadowRoot.querySelector("#confetti").setAttribute("popped", "");
        }, 0);
      }
    );
  }

  updateColor() {
    if (this.count === 18) {
      this.style.setProperty('--counter-color', 'blue'); 
    } else if (this.count === 21) {
      this.style.setProperty('--counter-color', 'red'); 
    } else if (this.count === this.min || this.count === this.max) {
      this.style.setProperty('--counter-color', 'purple'); 
    } else {
      this.style.setProperty('--counter-color', 'black'); 
    }
  }

  render() {
    return html`
    <div class ="wrapper">
  <div class ="counter" style="color: var(--counter-color);">${this.count}</div>
  <button @click="${this.decrement}" ?disabled="${this.count === this.min}">-</button>
      <button @click="${this.increment}" ?disabled="${this.count === this.max}">+</button>
  <div>${this.title}</div></div>
  <slot></slot>
</div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(counterApp.tag, counterApp);