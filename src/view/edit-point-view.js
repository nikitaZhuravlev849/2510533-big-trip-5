import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getFullDate, getOffersByType, getDestinationById, getDestinationByName } from '../utils/point.js';
import { EVENTS_TYPES, EMPTY_POINT, FormType, FLATPICKR_CONFIG } from '../consts.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createOfferTemplate(offer, selectedOffers, isDisabled) {
  const {id, title, price} = offer;
  const isChecked = selectedOffers.includes(id);

  return `
    <div class="event__offer-selector">
      <input 
        class="event__offer-checkbox  visually-hidden"
        id="event-offer-${id}-1"
        type="checkbox"
        name="event-offer-${id}"
        value="${id}"
        ${isChecked ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}
      >
      <label class="event__offer-label" for="event-offer-${id}-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>
  `;
}

function createTemplate(state, destinations, allOffers, formType) {
  const {id, type, destination, dateFrom, dateTo, basePrice, offers, isDisabled, isSaving, isDeleting} = state;
  const availableOffers = getOffersByType(type, allOffers);
  const destinationData = getDestinationById(destination, destinations) || '';
  const isDestinationValid = Boolean(destinationData && destinationData.pictures.length && destinationData.description);
  const deleteLabel = isDeleting ? 'Deleting...' : 'Delete';

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${EVENTS_TYPES.map((eventType) => `
                  <div class="event__type-item">
                    <input 
                      id="event-type-${eventType.toLowerCase()}-1"
                      class="event__${eventType.toLowerCase()}-input  visually-hidden"
                      type="radio"
                      name="event-type"
                      value="${eventType.toLowerCase()}"
                      ${type === eventType ? 'checked' : ''}
                      ${isDisabled ? 'disabled' : ''}
                    >
                    <label 
                      class="event__type-label  event__type-label--${eventType.toLowerCase()}"
                      for="event-type-${eventType.toLowerCase()}-1"
                    >
                      ${eventType}
                    </label>
                  </div>
                `).join('')}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${id}">${type}</label>
            <input
              class="event__input  event__input--destination"
              id="event-destination-${id}"
              type="text"
              name="event-destination"
              value="${destinationData.name || ''}" 
              list="destination-list-${id}" 
              required 
              ${isDisabled ? 'disabled' : ''}
            >
            <datalist id="destination-list-${id}">
              ${destinations.map((dest) => `<option value="${dest.name}"></option>`).join('')};
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input
              class="event__input  event__input--time"
              id="event-start-time-1"
              type="text"
              name="event-start-time"
              value="${dateFrom ? getFullDate(dateFrom) : ''}"
              ${isDisabled ? 'disabled' : ''}
            >
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input
              class="event__input  event__input--time"
              id="event-end-time-1"
              type="text"
              name="event-end-time"
              value="${dateTo ? getFullDate(dateTo) : ''}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input
              class="event__input event__input--price"
              id="event-price-1"
              type="text"
              name="event-price"
              value="${basePrice}"
              ${isDisabled ? 'disabled' : ''}
            >
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>
            ${formType === FormType.EDIT ? deleteLabel : 'Cancel'}
          </button>
          ${formType === FormType.EDIT ? `
            <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
              <span class="visually-hidden">Open event</span>
            </button>
          ` : ''}
        </header>
        ${(availableOffers.length || isDestinationValid) ? `
          <section class="event__details">
            ${availableOffers.length !== 0 ? `
              <section class="event__section  event__section--offers">
                <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                <div class="event__available-offers">
                  ${availableOffers.map((offer) => createOfferTemplate(offer, offers, isDisabled)).join('')}
                </div>
              </section>
            ` : ''}
            ${isDestinationValid ? `
              <section class="event__section  event__section--destination">
                <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                <p class="event__destination-description">${destinationData.description}</p>
                <div class="event__photos-container">
                  <div class="event__photos-tape">
                    ${destinationData.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
                  </div>
                </div>
              </section>
            ` : ''}
          </section>
        ` : ''}
      </form>
    </li>
  `;
}

export default class EditPointView extends AbstractStatefulView {
  #destinations;
  #offers;
  #cancelButtonClickHandler;
  #rollupButtonClickHandler;
  #submitButtonClickHandler;
  #deleteButtonClickHandler;
  #datepickerDateFrom;
  #datepickerDateTo;
  #formType;

  constructor({point = EMPTY_POINT, destinations, offers, rollupButtonClickHandler, submitButtonClickHandler, cancelButtonClickHandler, deleteButtonClickHandler, formType = FormType.EDIT}) {
    super();
    this._setState(this.#parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#rollupButtonClickHandler = rollupButtonClickHandler;
    this.#submitButtonClickHandler = submitButtonClickHandler;
    this.#cancelButtonClickHandler = cancelButtonClickHandler;
    this.#deleteButtonClickHandler = deleteButtonClickHandler;
    this.#formType = formType;
    this._restoreHandlers();
  }

  get template() {
    return createTemplate(this._state, this.#destinations, this.#offers, this.#formType);
  }

  _restoreHandlers() {
    const deleteCancelButtonElement = this.element.querySelector('.event__reset-btn');
    const eventTypesElement = this.element.querySelector('.event__type-group');
    const priceElement = this.element.querySelector('.event__input--price');
    const destinationElement = this.element.querySelector('.event__input--destination');
    const offersElements = this.element.querySelectorAll('.event__offer-checkbox');

    if (this.#formType === FormType.EDIT) {
      const rollupButtonElement = this.element.querySelector('.event__rollup-btn');
      rollupButtonElement.addEventListener('click', this.#rollupButtonElementClickHandler);
      deleteCancelButtonElement.addEventListener('click', this.#deleteButtonElementClickHandler);
    } else {
      deleteCancelButtonElement.addEventListener('click', this.#cancelButtonElementClickHandler);
    }

    this.element.addEventListener('submit', this.#submitButtonElementClickHandler);
    this.element.addEventListener('input', this.#formChangeHandler);
    eventTypesElement.addEventListener('change', this.#pointTypeChangeHandler);
    priceElement.addEventListener('change', this.#priceChangeHandler);
    destinationElement.addEventListener('change', this.#destinationChangeHandler);
    offersElements.forEach((element) => element.addEventListener('change', this.#offersChangeHandler));

    this.#initDatepickers();
    this.#formValidation(this.element);
  }

  removeElement() {
    super.removeElement();
    this.#datepickerDateFrom?.destroy();
    this.#datepickerDateTo?.destroy();
  }

  reset(point) {
    this.updateElement(this.#parsePointToState(point));
  }

  #parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  #parseStateToPoint() {
    const point = {...this._state};
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;
    return point;
  }

  #initDatepickers() {
    const dateFromElement = this.element.querySelector('[name="event-start-time"]');
    const dateToElement = this.element.querySelector('[name="event-end-time"]');

    this.#datepickerDateFrom = flatpickr(dateFromElement, {
      ...FLATPICKR_CONFIG,
      defaultDate: this._state.dateFrom,
      onClose: this.#dateFromClickHandler,
      maxDate: this._state.dateTo,
    });

    this.#datepickerDateTo = flatpickr(dateToElement, {
      ...FLATPICKR_CONFIG,
      defaultDate: this._state.dateTo,
      onClose: this.#dateToClickHandler,
      minDate: this._state.dateFrom,
    });
  }

  #formValidation(form) {
    const saveButtonElement = form.querySelector('.event__save-btn');
    const destinationValue = this.element.querySelector('.event__input--destination').value;
    const priceValue = this.element.querySelector('.event__input--price').value;
    const dateFromValue = this.element.querySelector('[name="event-start-time"]').value;
    const dateToValue = this.element.querySelector('[name="event-end-time"]').value;

    const isValid =
      priceValue
      && Number(priceValue) > 0
      && destinationValue
      && this.#destinations.some((dest) => dest.name === destinationValue)
      && dateFromValue
      && dateToValue;

    saveButtonElement.disabled = !isValid;
  }

  #formChangeHandler = (evt) => this.#formValidation(evt.target.form);

  #submitButtonElementClickHandler = (evt) => {
    evt.preventDefault();
    this.#submitButtonClickHandler(this.#parseStateToPoint());
  };

  #rollupButtonElementClickHandler = (evt) => {
    evt.preventDefault();
    this.#rollupButtonClickHandler();
  };

  #cancelButtonElementClickHandler = (evt) => {
    evt.preventDefault();
    this.#cancelButtonClickHandler();
  };

  #deleteButtonElementClickHandler = (evt) => {
    evt.preventDefault();
    this.#deleteButtonClickHandler(this._state);
  };

  #pointTypeChangeHandler = (evt) => this.updateElement({ type: evt.target.value, offers: [] });

  #priceChangeHandler = (evt) => this._setState({ basePrice: Number(evt.target.value) });

  #destinationChangeHandler = (evt) => {
    const selectedDestination = getDestinationByName(evt.target.value, this.#destinations);
    this.updateElement({ destination: selectedDestination ? selectedDestination.id : null });
  };

  #offersChangeHandler = (evt) => {
    const offers = this._state.offers;
    const checkedOffers = offers.includes(evt.target.value)
      ? offers.filter((offerId) => offerId !== evt.target.value)
      : [...offers, evt.target.value];
    this._setState({ offers: checkedOffers });
  };

  #dateFromClickHandler = ([date]) => {
    this._setState({ dateFrom: date });
    this.#datepickerDateTo.set('minDate', this._state.dateFrom);
  };

  #dateToClickHandler = ([date]) => {
    this._setState({ dateTo: date });
    this.#datepickerDateFrom.set('maxDate', this._state.dateTo);
  };
}
