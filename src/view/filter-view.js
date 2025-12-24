import AbstractView from '../framework/view/abstract-view.js';

function createFilterTemplate({filterType, isDisabled}, currentFilterType) {
  const isChecked = currentFilterType === filterType;

  return `
    <div class="trip-filters__filter">
      <input 
        id="${`filter-${filterType}`}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio" name="trip-filter"
        value="${filterType}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="trip-filters__filter-label" for="${`filter-${filterType}`}">${filterType}</label>
    </div>
  `;
}

function createTemplate(filters, currentFilterType) {
  return `
    <form class="trip-filters" action="#" method="get">
      ${filters.map((filter) => createFilterTemplate(filter, currentFilterType)).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `;
}

export default class FilterView extends AbstractView {
  #filters;
  #currentFilterType;
  #filterTypeChangeHandler;

  constructor({filters, currentFilterType, filterTypeChangeHandler}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#filterTypeChangeHandler = filterTypeChangeHandler;

    this.element.addEventListener('change', this.#filterElementChangeHandler);
  }

  get template() {
    return createTemplate(this.#filters, this.#currentFilterType);
  }

  #filterElementChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    evt.preventDefault();
    this.#filterTypeChangeHandler(evt.target.value);
  };
}
