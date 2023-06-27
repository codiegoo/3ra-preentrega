const TicketsRepository = require('./repository/tickets.repository')


async function checkDataTicket(code, userEmail, cart){
  try {
    const ticketsRepository = new TicketsRepository()
    return ticketsRepository.processDataTicket(code, userEmail, cart)
  } catch (error) {
    return error
  }
}

module.exports = checkDataTicket