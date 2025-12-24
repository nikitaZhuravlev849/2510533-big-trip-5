import EditPointView from '../view/edit-point-view.js';
import { remove, render, RenderPosition } from '../framework/render';
import { ActionType, UpdateType, FormType } from '../consts.js';
import { createEscKeydownHandler } from '../utils/common.js';

export default class NewPointPresenter {
  #containerElement;
  #component;
  #pointsListModel;
  #dataChangeHandler;
  #componentDestroyHandler;

  constructor({containerElement, pointsListModel, dataChangeHandler, componentDestroyHandler}) {
    this.#containerElement = containerElement;
    this.#pointsListModel = pointsListModel;
    this.#dataChangeHandler = dataChangeHandler;
    this.#componentDestroyHandler = componentDestroyHandler;
  }

  init() {
    if(this.#component) {
      return;
    }

    this.#component = new EditPointView({
      destinations: this.#pointsListModel.destinations,
      offers: this.#pointsListModel.offers,
      formType: FormType.CREATE,
      rollupButtonClickHandler: this.#rollupButtonClickHandler,
      submitButtonClickHandler: this.#submitButtonClickHandler,
      cancelButtonClickHandler: this.#cancelButtonClickHandler,
    });

    render(this.#component, this.#containerElement, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  destroy() {
    if (!this.#component) {
      return;
    }

    this.#componentDestroyHandler();
    remove(this.#component);
    this.#component = null;
    document.removeEventListener('keydown', this.#escKeydownHandler);
  }

  setSaving() {
    this.#component.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#component.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#component.shake(resetFormState);
  }

  #submitButtonClickHandler = (pointData) => this.#dataChangeHandler(ActionType.ADD_POINT, UpdateType.MINOR, pointData);

  #rollupButtonClickHandler = () => this.destroy();

  #cancelButtonClickHandler = () => this.destroy();

  #escKeydownHandler = createEscKeydownHandler(() => this.destroy());
}
