import SortView from '../view/sort-view.js';
import { render, replace, RenderPosition } from '../framework/render.js';
import { UpdateType } from '../consts.js';
import { pointsFilters } from '../utils/filter.js';

export default class SortPresenter {
  #containerElement;
  #sortModel;
  #filterModel;
  #pointsListModel;
  #component;

  constructor({ containerElement, sortModel, filterModel, pointsListModel }) {
    this.#containerElement = containerElement;
    this.#sortModel = sortModel;
    this.#filterModel = filterModel;
    this.#pointsListModel = pointsListModel;

    this.#sortModel.addObserver(this.#modelChangeHandler);
    this.#pointsListModel.addObserver(this.#modelChangeHandler);
  }

  init() {
    const previousComponent = this.#component;
    const filteredPoints = pointsFilters[this.#filterModel.currentFilterType](this.#pointsListModel.points);
    this.#component = new SortView({
      currentSortType: this.#sortModel.currentSortType,
      sortTypeChangeHandler: this.#sortTypeChangeHandler,
      isDisabled: filteredPoints.length === 0,
    });

    if (!previousComponent) {
      render(this.#component, this.#containerElement, RenderPosition.AFTERBEGIN);
    } else {
      replace(this.#component, previousComponent);
    }
  }

  #sortTypeChangeHandler = (sortType) => this.#sortModel.setSort(UpdateType.MINOR, sortType);

  #modelChangeHandler = () => this.init();
}
