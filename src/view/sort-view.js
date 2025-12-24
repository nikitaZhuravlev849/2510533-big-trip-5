import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../consts.js';

function createSortItemTemplate(sortType, currentSortType, isDisabled) {
  const checked = sortType === currentSortType;
  isDisabled = isDisabled || sortType === SortType.OFFERS || sortType === SortType.EVENT;

  return `
    <div class="trip-sort__item trip-sort__item--${sortType}">
      <input
        id="sort-${sortType}"
        class="trip-sort__input visually-hidden"
        type="radio"
        name="trip-sort"
        value="${sortType}"
        ${checked && !isDisabled ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}>
      <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label></div>
    `;
}

function createTemplate(currentSortType, isDisabled) {
  return `
    <form class="trip-sort" action="#" method="get">
      ${Object.values(SortType).map((type) => createSortItemTemplate(type, currentSortType, isDisabled)).join('')}
    </form>
  `;
}

export default class SortView extends AbstractView {
  #sortTypeChangeHandler;
  #currentSortType;
  #isDisabled;

  constructor({ sortTypeChangeHandler, currentSortType, isDisabled }) {
    super();
    this.#sortTypeChangeHandler = sortTypeChangeHandler;
    this.#currentSortType = currentSortType;
    this.#isDisabled = isDisabled;

    this.element.addEventListener('change', this.#sortElementChangeHandler);
  }

  get template() {
    return createTemplate(this.#currentSortType, this.#isDisabled);
  }

  #sortElementChangeHandler = (evt) => {
    if (this.#isDisabled || evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.#sortTypeChangeHandler(evt.target.value);
  };
}
