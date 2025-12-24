import PointView from '../view/point-view.js';
import EditPointView from '../view/edit-point-view.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode, ActionType, UpdateType } from '../consts.js';
import { isSameDates } from '../utils/point.js';
import { createEscKeydownHandler } from '../utils/common.js';

export default class PointPresenter {
  #destinations;
  #offers;
  #containerElement;
  #component;
  #editComponent;
  #dataChangeHandler;
  #modeChangeHandler;
  #mode = Mode.DEFAULT;
  #pointData;

  constructor({destinations, offers, containerElement, dataChangeHandler, modeChangeHandler}) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#containerElement = containerElement;
    this.#dataChangeHandler = dataChangeHandler;
    this.#modeChangeHandler = modeChangeHandler;
  }

  init(point) {
    this.#pointData = point;
    const previusComponent = this.#component;
    const previusEditComponent = this.#editComponent;

    this.#component = new PointView({
      point,
      destinations: this.#destinations,
      offers: this.#offers,
      rollupButtonClickHandler: this.#componentRollupButtonClickHandler,
      favoriteButtonClickHandler: this.#favoriteButtonClickHandler,
    });

    this.#editComponent = new EditPointView({
      point,
      destinations: this.#destinations,
      offers: this.#offers,
      rollupButtonClickHandler: this.#editComponentRollupButtonClickHandler,
      submitButtonClickHandler: this.#submitButtonClickHandler,
      deleteButtonClickHandler: this.#deleteButtonClickHandler,
    });

    if (!previusComponent || !previusEditComponent) {
      render(this.#component, this.#containerElement);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#component, previusComponent);
    } else {
      replace(this.#component, previusEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove([previusComponent, previusEditComponent]);
  }

  destroy() {
    document.removeEventListener('keydown', this.#escKeydownHandler);
    remove([this.#component, this.#editComponent]);
  }

  resetEditViewToPointView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#editComponent.reset(this.#pointData);
      replace(this.#component, this.#editComponent);
      document.removeEventListener('keydown', this.#escKeydownHandler);
      this.#mode = Mode.DEFAULT;
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editComponent.updateElement({ isDisabled: true, isSaving: true });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editComponent.updateElement({ isDisabled: true, isDeleting: true });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#component.shake();
      return;
    }
    this.#editComponent.shake(this.#editComponent.updateElement({ isDisabled: false, isSaving: false, isDeleting: false }));
  }

  #componentRollupButtonClickHandler = () => {
    this.#modeChangeHandler();
    this.#mode = Mode.EDITING;
    replace(this.#editComponent, this.#component);
    document.addEventListener('keydown', this.#escKeydownHandler);
  };

  #editComponentRollupButtonClickHandler = () => this.resetEditViewToPointView();

  #submitButtonClickHandler = async (updatedPoint) => {
    const isMinor =
      !isSameDates(updatedPoint.dateFrom, this.#pointData.dateFrom) ||
      !isSameDates(updatedPoint.dateTo, this.#pointData.dateTo) ||
      updatedPoint.basePrice !== this.#pointData.basePrice;

    await this.#dataChangeHandler(
      ActionType.UPDATE_POINT,
      isMinor ? UpdateType.MINOR : UpdateType.PATCH,
      updatedPoint
    );
  };

  #deleteButtonClickHandler = async (pointToDelete) => {
    await this.#dataChangeHandler(ActionType.DELETE_POINT, UpdateType.MINOR, pointToDelete);
  };

  #favoriteButtonClickHandler = () => this.#dataChangeHandler(
    ActionType.UPDATE_POINT, UpdateType.MINOR,
    {...this.#pointData, isFavorite: !this.#pointData.isFavorite}
  );

  #escKeydownHandler = createEscKeydownHandler(() => this.resetEditViewToPointView());
}
