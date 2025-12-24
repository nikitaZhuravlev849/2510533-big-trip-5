import FilterView from '../view/filter-view.js';
import { render, replace } from '../framework/render.js';
import { FilterType, UpdateType } from '../consts.js';
import { pointsFilters } from '../utils/filter.js';

export default class FilterPresenter {
  #containerElement;
  #filterModel;
  #pointsListModel;
  #component;

  constructor({ containerElement, filterModel, pointsListModel }) {
    this.#containerElement = containerElement;
    this.#filterModel = filterModel;
    this.#pointsListModel = pointsListModel;

    this.#filterModel.addObserver(this.#modelChangeHandler);
    this.#pointsListModel.addObserver(this.#modelChangeHandler);
  }

  init() {
    const previusComponent = this.#component;
    this.#component = new FilterView({
      filters: Object.values(FilterType).map((filterType) => ({
        filterType,
        isDisabled: pointsFilters[filterType](this.#pointsListModel.points).length === 0
      })),
      currentFilterType: this.#filterModel.currentFilterType,
      filterTypeChangeHandler: this.#filterTypeChangeHandler,
    });

    if (!previusComponent) {
      render(this.#component, this.#containerElement);
    } else {
      replace(this.#component, previusComponent);
    }
  }

  #filterTypeChangeHandler = (filterType) => this.#filterModel.setFilter(UpdateType.MAJOR, filterType);

  #modelChangeHandler = () => this.init();
}
