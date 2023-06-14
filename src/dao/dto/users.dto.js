class UserDTO {
  constructor(userSession){
    this.first_name = userSession.first_name
    this.last_name = userSession.last_name
    this.email = userSession.email
    this.role = userSession.role
  }
}

module.exports = UserDTO