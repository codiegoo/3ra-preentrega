
const errorMessages = {
  400: 'Solicitud incorrecta',
  401: 'No autorizado',
  403: 'Acceso prohibido',
  404: 'No encontrado',
  500: 'Error interno del servidor'
}

class ErrorRepository extends Error {
  constructor(message, code) {
    super(message || errorMessages[code])
    this.code = code
  }
}

module.exports = ErrorRepository
