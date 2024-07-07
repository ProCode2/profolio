interface ELementsToMessWith {
  [key: string]: CustomElement
}

interface CustomElement {
  element: Element;
  uuid: string;
  class_removed: boolean;
  removed_class: string[];
}

function uuid(): string {
  // Create an array to hold 16 bytes (128 bits)
  const bytes = new Uint8Array(16);
  // Fill the array with random values
  window.crypto.getRandomValues(bytes);

  // Set the 4 most significant bits of the 7th byte to 0100 (UUID version 4)
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set the 2 most significant bits of the 9th byte to 10 (UUID variant 1)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  // Convert bytes to a string in the format of a UUID
  const hexValues = Array.from(bytes, byte => byte.toString(16).padStart(2, '0'));
  return `${hexValues.slice(0, 4).join('')}-${hexValues.slice(4, 6).join('')}-${hexValues.slice(6, 8).join('')}-${hexValues.slice(8, 10).join('')}-${hexValues.slice(10, 16).join('')}`;
}

export class StyleManager {
  private _elements: ELementsToMessWith = {};
  private _intervalId: number | null = null;

  constructor() {
    this._initMouseListeners();
  }

  loadELements = () => {
    [...document.querySelectorAll(".mess")].forEach(elem => {
      let uid = uuid();
      this._elements[uid] = {
        element: elem,
        uuid: uid,
        class_removed: false,
        removed_class: []
      };
    });
  }

  private _initMouseListeners() {
    window.addEventListener('mousemove', (event: MouseEvent) => {
      const { clientX, view } = event;
      if (!view) return;
      const width = view.innerWidth;
      console.log(width, clientX);

      if (clientX < width / 2) {
        // Move to the left
        if (this._intervalId !== null) {
          clearInterval(this._intervalId);
        }
        this._intervalId = window.setInterval(() => this._mess(), 100);
      } else {
        // Move to the right
        if (this._intervalId !== null) {
          clearInterval(this._intervalId);
        }
        this._intervalId = window.setInterval(() => this._fix(), 350);
      }
    });
  }

  private _mess() {
    const keys = Object.keys(this._elements).filter(k => !this._elements[k].class_removed);
    console.log("KEYS", keys);
    const randomIndex = Math.floor(Math.random() * keys.length);

    console.log("RANDOM", randomIndex)
    console.log("elem", this._elements)

    if (keys.length === 0) {
      return;
    }

    let randomElement = this._elements[keys[randomIndex]]
    if (!randomElement.class_removed) {
      let classList = [...randomElement.element.classList.entries()];
      randomElement.element.classList.remove(...classList.map(c => c[1]));
      this._elements[keys[randomIndex]].removed_class = classList.map(c => c[1]);
      this._elements[keys[randomIndex]].class_removed = true;
    }

  }


  private _fix() {
    const keys = Object.keys(this._elements).filter(k => this._elements[k].class_removed);
    const randomIndex = Math.floor(Math.random() * keys.length);
    if (keys.length === 0) {
      return;
    }

    let randomElement = this._elements[keys[randomIndex]]
    if (randomElement.class_removed) {
      randomElement.element.classList.add(...randomElement.removed_class);
      this._elements[keys[randomIndex]].removed_class = [];
      this._elements[keys[randomIndex]].class_removed = false;
    }

  }


}
