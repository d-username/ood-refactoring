class Movies {
  // constructor() {

  // }

  movieExists(moviesList, movieName) {
    for (let i = 0; i < moviesList.length; i++) {
      if (moviesList[i].name === movieName) {
        return true
      }
    }
    return false
  }

  isRatingValid(rating) {
     if (rating !== 'U' && rating !== 'PG') {
      if (rating !== '12' && rating !== '15' && rating != '18') {
        return false
      }
    }
    return true
  }
}

module.exports = Movies
