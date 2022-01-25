module.exports = function ForbidenError(
  message = 'Não tem acesso ao recurso solicitado!',
) {
  this.name = 'forbidenError';
  this.message = message;
};
