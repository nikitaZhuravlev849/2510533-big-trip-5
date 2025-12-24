import AbstractView from '../framework/view/abstract-view.js';
import { EmptyListMessage } from '../consts.js';

export default class PointListView extends AbstractView {
  #currentFilterType;

  constructor(currentFilterType) {
    super();
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return `<p class="trip-events__msg">${EmptyListMessage[this.#currentFilterType]}</p>`;
  }
}
