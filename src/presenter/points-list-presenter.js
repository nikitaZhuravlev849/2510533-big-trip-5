import PointListView from '../view/point-list-view.js';
import LoadingView from '../view/loading-view.js';
import ErrorView from '../view/error-view.js';
import EmptyPointsListMessageView from '../view/empty-points-list-message-view.js';
import PointPresenter from './point-presenter.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { SortType, ActionType, UpdateType, FilterType, TimeLimit } from '../consts.js';
import { pointsSorters } from '../utils/sort.js';
import { pointsFilters } from '../utils/filter.js';
import NewPointPresenter from './new-point-presenter.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class PointsListPresenter {
  #component = new PointListView();
  #containerElement;
  #pointsListModel;
  #filterModel;
  #sortModel;
  #newPointButtonPresenter;
  #pointsPresenters = new Map();
  #emptyComponent;
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();
  #isLoading = true;
  #uiBlocker = new UiBlocker({ lowerLimit: TimeLimit.LOWER_LIMIT, upperLimit: TimeLimit.UPPER_LIMIT });
  #newPointPresenter;

  constructor({ containerElement, filterModel, sortModel, pointsListModel, newPointButtonPresenter }) {
    this.#containerElement = containerElement;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
    this.#pointsListModel = pointsListModel;
    this.#newPointButtonPresenter = newPointButtonPresenter;

    this.#pointsListModel.addObserver(this.#modelChangeHandler);
    this.#filterModel.addObserver(this.#modelChangeHandler);
    this.#sortModel.addObserver(this.#modelChangeHandler);

    this.#newPointPresenter = new NewPointPresenter({
      containerElement: this.#component.element,
      pointsListModel: this.#pointsListModel,
      dataChangeHandler: this.#dataChangeHandler,
      componentDestroyHandler: this.#newPointComponentDestroyHandler,
    });
  }

  init() {
    this.#newPointButtonPresenter.disableButton();
    this.#renderList();
  }

  #renderList() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    render(this.#component, this.#containerElement);
    const filteredPoints = pointsFilters[this.#filterModel.currentFilterType](this.#pointsListModel.points);
    if (filteredPoints.length) {
      pointsSorters[this.#sortModel.currentSortType](filteredPoints);
      filteredPoints.forEach((point) => this.#renderPoint(point));
    } else {
      this.#renderEmptyList();
    }
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      destinations: this.#pointsListModel.destinations,
      offers: this.#pointsListModel.offers,
      containerElement: this.#component.element,
      dataChangeHandler: this.#dataChangeHandler,
      modeChangeHandler: this.#modeChangeHandler
    });
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #renderEmptyList() {
    this.#emptyComponent = new EmptyPointsListMessageView(this.#filterModel.currentFilterType);
    render(this.#emptyComponent, this.#component.element, RenderPosition.AFTERBEGIN);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#containerElement, RenderPosition.BEFOREEND);
  }

  #renderError() {
    render(this.#errorComponent, this.#containerElement, RenderPosition.BEFOREEND);
  }

  #clearPointsList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
    this.#newPointPresenter.destroy();
    if (this.#emptyComponent) {
      remove(this.#emptyComponent);
    }
  }

  newPointButtonClickHandler = () => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButtonPresenter.disableButton();
    this.#newPointPresenter.init();
  };

  #modelChangeHandler = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderList();
        break;
      case UpdateType.MAJOR:
        this.#sortModel.setSort(UpdateType.MINOR, SortType.DAY);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        if (data.isError) {
          this.#renderError();
        } else {
          this.#renderList();
        }
    }
  };

  #dataChangeHandler = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    const presenter = this.#pointsPresenters.get(update.id);
    try {
      switch (actionType) {
        case ActionType.UPDATE_POINT:
          presenter.setSaving();
          await this.#pointsListModel.updatePoint(updateType, update);
          break;
        case ActionType.DELETE_POINT:
          presenter.setDeleting();
          await this.#pointsListModel.deletePoint(updateType, update);
          break;
        case ActionType.ADD_POINT:
          this.#newPointPresenter.setSaving();
          await this.#pointsListModel.addPoint(updateType, update);
      }
    } catch {
      if (actionType === ActionType.ADD_POINT) {
        this.#newPointPresenter.setAborting();
      } else {
        presenter.setAborting();
      }
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #newPointComponentDestroyHandler = () => this.#newPointButtonPresenter.enableButton();

  #modeChangeHandler = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetEditViewToPointView());
    this.#newPointPresenter.destroy();
  };
}
