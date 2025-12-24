import NewPointButtonView from '../view/new-point-button-view.js';
import { render } from '../framework/render.js';
import { UpdateType } from '../consts.js';

export default class NewPointButtonPresenter {
  #containerElement;
  #component;

  constructor({containerElement, pointsListModel}) {
    this.#containerElement = containerElement;
    pointsListModel.addObserver(this.#modelChangeHandler);
  }

  init({buttonClickHandler}) {
    this.#component = new NewPointButtonView({ buttonClickHandler: buttonClickHandler });
    render(this.#component, this.#containerElement);
  }

  disableButton() {
    this.#component?.setDisabled(true);
  }

  enableButton() {
    this.#component?.setDisabled(false);
  }

  #modelChangeHandler = (updateType, { isError } = {}) => {
    if (updateType === UpdateType.INIT) {
      if (isError) {
        this.disableButton();
      } else {
        this.enableButton();
      }
    }
  };
}
