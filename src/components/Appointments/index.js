import React, {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import {format} from 'date-fns'
import AppointmentItem from '../AppointmentItem'
import './index.css'

class Appointments extends Component {
  state = {
    appointmentsList: [],
    titleInput: '',
    dateInput: '',
    isFilterActive: false,
    showTitleErrorMessage: false,
    showDateErrorMessage: false,
  }

  componentDidMount() {
    const savedAppointments = localStorage.getItem('appointments')
    if (savedAppointments) {
      this.setState({appointmentsList: JSON.parse(savedAppointments)})
    }
  }

  componentDidUpdate() {
    localStorage.setItem(
      'appointments',
      JSON.stringify(this.state.appointmentsList),
    )
  }

  toggleIsStarred = id => {
    this.setState(prevState => ({
      appointmentsList: prevState.appointmentsList.map(eachAppointment => {
        if (id === eachAppointment.id) {
          return {...eachAppointment, isStarred: !eachAppointment.isStarred}
        }
        return eachAppointment
      }),
    }))
  }

  onFilter = () => {
    const {isFilterActive} = this.state

    this.setState({
      isFilterActive: !isFilterActive,
    })
  }

  onChangeDateInput = event => {
    const {value} = event.target
    this.setState({
      dateInput: value,
      showDateErrorMessage: false, // Hide error message when date input changes
    })
  }

  onChangeTitleInput = event => {
    const {value} = event.target
    this.setState({
      titleInput: value,
      showTitleErrorMessage: false, // Hide error message when title input changes
    })
  }

  onAddAppointment = event => {
    event.preventDefault()
    const {titleInput, dateInput} = this.state

    // Check if the title input is empty
    if (!titleInput.trim()) {
      this.setState({showTitleErrorMessage: true}) // Show error message
      return // Exit the function if the title is empty
    }

    // Check if the date input is empty
    if (!dateInput) {
      this.setState({showDateErrorMessage: true}) // Show error message
      return // Exit the function if the date is empty
    }

    const formattedDate = dateInput
      ? format(new Date(dateInput), 'dd MMMM yyyy, EEEE')
      : ''
    const newAppointment = {
      id: uuidv4(),
      title: titleInput,
      date: formattedDate,
      isStarred: false,
    }

    this.setState(prevState => ({
      appointmentsList: [...prevState.appointmentsList, newAppointment],
      titleInput: '',
      dateInput: '',
    }))
  }

  onDeleteAppointment = id => {
    this.setState(prevState => ({
      appointmentsList: prevState.appointmentsList.filter(
        appointment => appointment.id !== id,
      ),
    }))
  }

  onDeleteAppointments = () => {
    this.setState({appointmentsList: []})
    localStorage.removeItem('appointments')
  }

  getFilteredAppointmentsList = () => {
    const {appointmentsList, isFilterActive} = this.state

    if (isFilterActive) {
      return appointmentsList.filter(
        eachTransaction => eachTransaction.isStarred === true,
      )
    }
    return appointmentsList
  }

  render() {
    const {
      titleInput,
      dateInput,
      isFilterActive,
      showTitleErrorMessage,
      showDateErrorMessage,
    } = this.state
    const filterClassName = isFilterActive ? 'filter-filled' : 'filter-empty'
    const {appointmentsList} = this.state // Destructuring appointmentsList directly

    const filteredAppointmentsList = this.getFilteredAppointmentsList()

    return (
      <div className="app-container">
        <div className="responsive-container">
          <div className="appointments-container">
            <div className="add-appointment-container">
              <form className="form" onSubmit={this.onAddAppointment}>
                <h1 className="add-appointment-heading">Add Appointment</h1>
                <label htmlFor="title" className="label">
                  TITLE
                </label>
                <input
                  type="text"
                  id="title"
                  value={titleInput}
                  onChange={this.onChangeTitleInput}
                  className="input"
                  placeholder="Title"
                />
                {showTitleErrorMessage && (
                  <div className="error-message">
                    Please fill the title field
                  </div>
                )}
                <label htmlFor="date" className="label">
                  DATE
                </label>
                <input
                  type="date"
                  id="date"
                  value={dateInput}
                  onChange={this.onChangeDateInput}
                  className="input"
                />
                {showDateErrorMessage && (
                  <div className="error-message">**Please select a date**</div>
                )}
                <button type="submit" className="add-button">
                  Add
                </button>
              </form>
              <img
                src="https://assets.ccbp.in/frontend/react-js/appointments-app/appointments-img.png"
                alt="appointments"
                className="appointments-img"
              />
            </div>
            <hr className="hr" />
            <div
              style={{
                maxHeight: '10vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '5px',
                paddingBottom: '15px',
              }}
            >
              <button
                type="button"
                onClick={this.onDeleteAppointments}
                className="add-button"
                style={{marginTop: '5px', marginBottom: '15px'}}
              >
                Delete All Appointments
              </button>
            </div>
            <div className="bottomContainer">
              <div className="header-with-filter-container">
                <h1 className="appointments-heading">Appointments</h1>
                <button
                  type="button"
                  className={`filter-style ${filterClassName}`}
                  onClick={this.onFilter}
                >
                  Starred
                </button>
              </div>
              <ul className="appointments-list">
                {filteredAppointmentsList.map(eachAppointment => (
                  <div key={eachAppointment.id} className="appointment-item">
                    <AppointmentItem
                      appointmentDetails={eachAppointment}
                      toggleIsStarred={this.toggleIsStarred}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        this.onDeleteAppointment(eachAppointment.id)
                      }
                      className="add-button"
                      style={{margin: '0px'}}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Appointments
