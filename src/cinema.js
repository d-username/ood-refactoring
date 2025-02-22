const Screens = require('./screens.js')
const Movies = require('./movies.js')

class Cinema {
  constructor() {
    this.movies = []
    this.screens = []
  }

  addScreen(screenName, capacity) {
    const screens = new Screens()
    //first check in the capacity is within the limit, if yes then return error
    if (!screens.screenCapacity(capacity)) {
      return 'Exceeded max capacity'
    }
    //check if screen already exist in a separate method
    if (screens.screenExists(this.screens, screenName)) {
      return 'Screen already exists'
    }
    //use a separate class "screens", for creating screens.
    const newScreen = screens.createScreen(screenName, capacity)
    this.screens.push(newScreen)
  }

  // Add a new movie
  addMovie(movieName, rating, duration) {
    const movies = new Movies()
    //Check the film doesn't already exist - separate method
    if (movies.movieExists(this.movies, movieName)) {
      return 'Film already exists'
    }
   
    // TODO: //Check the rating is valid - separate method
    if (!movies.isRatingValid(rating)) {
      return 'Invalid rating'
    }

    // TODO: //Check duration - separate method
    const result = /^(\d?\d):(\d\d)$/.exec(duration)
    if (result == null) {
      return 'Invalid duration'
    }


    const hours = parseInt(result[1])
    const mins = parseInt(result[2])
    if (hours <= 0 || mins > 60) {
      return 'Invalid duration'
    }

    // TODO: //use a separate class "Movies", for creating movies, where I would creade the new move and that would be pushed to movies-array
    this.movies.push({ name: movieName, rating: rating, duration: duration })
  }

  // Add a showing of a with a starttime to a specific screen
  addShowing(movie, screenName, startTime) {
    let result = /^(\d?\d):(\d\d)$/.exec(startTime)
    if (result == null) {
      return 'Invalid start time'
    }
    // TODO: //here checking if start time is valid - could be separate method
    const intendedStartTimeHours = parseInt(result[1])
    const intendedStartTimeMinutes = parseInt(result[2])
    if (intendedStartTimeHours <= 0 || intendedStartTimeMinutes > 60) {
      return 'Invalid start time'
    }

    // TODO: //find the film by name in movies list - separate method
    let film = null
    for (let i = 0; i < this.movies.length; i++) {
      if (this.movies[i].name == movie) {
        film = this.movies[i]
      }
    }

    if (film === null) {
      return 'Invalid film'
    }

    // TODO: //separate method for - From duration, work out intended end time if end time is over midnight, it's an error - Check duration
    result = /^(\d?\d):(\d\d)$/.exec(film.duration)
    if (result == null) {
      return 'Invalid duration'
    }

    const durationHours = parseInt(result[1])
    const durationMins = parseInt(result[2])

    // Add the running time to the duration
    let intendedEndTimeHours = intendedStartTimeHours + durationHours

    // It takes 20 minutes to clean the screen so add on 20 minutes to the duration
    // when working out the end time
    let intendedEndTimeMinutes = intendedStartTimeMinutes + durationMins + 20
    if (intendedEndTimeMinutes >= 60) {
      intendedEndTimeHours += Math.floor(intendedEndTimeMinutes / 60)
      intendedEndTimeMinutes = intendedEndTimeMinutes % 60
    }

    if (intendedEndTimeHours >= 24) {
      return 'Invalid start time - film ends after midnight'
    }

    // TODO: //Find the screen by name - separate method
    let theatre = null
    for (let i = 0; i < this.screens.length; i++) {
      if (this.screens[i].name == screenName) {
        theatre = this.screens[i]
      }
    }

    if (theatre === null) {
      return 'Invalid screen'
    }

    // TODO: // this section - working with time, hours and minutes need more attention and i need to read up more about it!!!

    // Go through all existing showings for this film and make
    // sure the start time does not overlap
    let error = false
    for (let i = 0; i < theatre.showings.length; i++) {
      // Get the start time in hours and minutes
      const startTime = theatre.showings[i].startTime
      result = /^(\d?\d):(\d\d)$/.exec(startTime)
      if (result == null) {
        return 'Invalid start time'
      }

      const startTimeHours = parseInt(result[1])
      const startTimeMins = parseInt(result[2])
      if (startTimeHours <= 0 || startTimeMins > 60) {
        return 'Invalid start time'
      }

      // Get the end time in hours and minutes
      const endTime = theatre.showings[i].endTime
      result = /^(\d?\d):(\d\d)$/.exec(endTime)
      if (result == null) {
        return 'Invalid end time'
      }

      const endTimeHours = parseInt(result[1])
      const endTimeMins = parseInt(result[2])
      if (endTimeHours <= 0 || endTimeMins > 60) {
        return 'Invalid end time'
      }

      // if intended start time is between start and end
      const d1 = new Date()
      d1.setMilliseconds(0)
      d1.setSeconds(0)
      d1.setMinutes(intendedStartTimeMinutes)
      d1.setHours(intendedStartTimeHours)

      const d2 = new Date()
      d2.setMilliseconds(0)
      d2.setSeconds(0)
      d2.setMinutes(intendedEndTimeMinutes)
      d2.setHours(intendedEndTimeHours)

      const d3 = new Date()
      d3.setMilliseconds(0)
      d3.setSeconds(0)
      d3.setMinutes(startTimeMins)
      d3.setHours(startTimeHours)

      const d4 = new Date()
      d4.setMilliseconds(0)
      d4.setSeconds(0)
      d4.setMinutes(endTimeMins)
      d4.setHours(endTimeHours)

      if (
        (d1 > d3 && d1 < d4) ||
        (d2 > d3 && d2 < d4) ||
        (d1 < d3 && d2 > d4)
      ) {
        error = true
        break
      }
    }

    if (error) {
      return 'Time unavailable'
    }

    // Add the new start time and end time to the showing
    theatre.showings.push({
      film: film,
      startTime: startTime,
      endTime: intendedEndTimeHours + ':' + intendedEndTimeMinutes
    })
  }

  allShowings() {
    const showings = {}
    for (let i = 0; i < this.screens.length; i++) {
      const screen = this.screens[i]
      for (let j = 0; j < screen.showings.length; j++) {
        const showing = screen.showings[j]
        if (!showings[showing.film.name]) {
          showings[showing.film.name] = []
        }
        showings[showing.film.name].push(
          `${screen.name} ${showing.film.name} (${showing.film.rating}) ${showing.startTime} - ${showing.endTime}`
        )
      }
    }
    return showings
  }
}

module.exports = Cinema
