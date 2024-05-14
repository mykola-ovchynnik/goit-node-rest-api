export const setUpdateOptions = function (next) {
  this.options.runValidators = true;
  this.options.returnDocument = 'after';
  next();
};

export const handleSaveError = (error, data, next) => {
  error.status = 400;
  next();
};
