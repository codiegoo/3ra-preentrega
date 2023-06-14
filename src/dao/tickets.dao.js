const TicketsRepository = require('./repository/tickets.repository')


async function checkDataTicket(code, userEmail, cart){
  const ticketsRepository = new TicketsRepository()
  return ticketsRepository.processDataTicket(code, userEmail, cart)
}

module.exports = checkDataTicket