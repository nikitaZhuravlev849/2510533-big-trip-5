import AbstractView from '../framework/view/abstract-view.js';

export default class NewPointButtonView extends AbstractView {
  #buttonClickHandler;

  constructor({ buttonClickHandler }) {
    super();
    this.#buttonClickHandler = buttonClickHandler;
    this.element.addEventListener('click', this.#buttonElementClickHandler);
  }

  get template() {
    return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
  }

  setDisabled = (isDisabled) => {
    this.element.disabled = isDisabled;
  };

  #buttonElementClickHandler = (evt) => {
    evt.preventDefault();
    this.#buttonClickHandler();
  };
}
