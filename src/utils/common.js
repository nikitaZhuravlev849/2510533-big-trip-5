export const createEscKeydownHandler = (cb) => ((evt) => {
  if (evt.key === 'Escape' || evt.key === 'Esc') {
    evt.preventDefault();
    cb();
  }
});
