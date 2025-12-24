import { CITIES_LENGTH_BORDER } from '../consts.js';
import AbstractView from '../framework/view/abstract-view.js';

function createTemplate(dateRange, routeCities, totalPrice) {
  const route = routeCities.length > CITIES_LENGTH_BORDER ? `${routeCities[0]} &mdash; ... &mdash; ${routeCities.at(-1)}` : routeCities.join(' &mdash; ');

  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>

        <p class="trip-info__dates">${dateRange.startDate}&nbsp;&mdash;&nbsp;${dateRange.endDate}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>
  `;
}

export default class TripInfoView extends AbstractView {
  #dateRange;
  #routeCities;
  #totalPrice;

  constructor(dateRange, routeCities, totalPrice) {
    super();
    this.#dateRange = dateRange;
    this.#routeCities = routeCities;
    this.#totalPrice = totalPrice;
  }

  get template() {
    return createTemplate(this.#dateRange, this.#routeCities, this.#totalPrice);
  }
}
