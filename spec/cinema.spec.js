const Cinema = require("../src/cinema")

describe("Cinema", () => {
  let cinema

  beforeEach(() => {
    cinema = new Cinema()
  })

  it("creates new screens", () => {
    cinema.addScreen("Screen 1", 20)
    cinema.addScreen("Screen 2", 25)

    const expected = [
      {
        name: "Screen 1",
        capacity: 20,
        showings: [],
      },
      {
        name: "Screen 2",
        capacity: 25,
        showings: [],
      },
    ]

    expect(cinema.screens).toEqual(expected)
  })

  it("returns error trying to create duplicate screen", () => {
    cinema.addScreen("Screen 1", 20)
    const result = cinema.addScreen("Screen 1", 25)

    const expected = "Screen already exists"

    expect(result).toEqual(expected)
  })

  it("adds new films", () => {
    cinema.addMovie("Nomad Land", "12", "1:48")
    cinema.addMovie("The Power of the Dog", "15", "2:08")

    const expected = [
      {
        name: "Nomad Land",
        rating: "12",
        duration: "1:48",
      },
      {
        name: "The Power of the Dog",
        rating: "15",
        duration: "2:08",
      },
    ]

    expect(cinema.movies).toEqual(expected)
  })

  it("returns error trying to create duplicate film", () => {
    cinema.addMovie("Nomad Land", "12", "1:48")
    const result = cinema.addMovie("Nomad Land", "15", "2:08")

    const expected = "Film already exists"

    expect(result).toEqual(expected)
  })

  it("returns error trying to create film with invalid rating", () => {
    const invalidRatings = ["20", "0", "UUU"]
    const validRatings = ["U", "PG", "12", "15", "18"]

    for (const invalidRating of invalidRatings) {
      const result = cinema.addMovie("Invalid film", invalidRating, "2:08")
      const expected = "Invalid rating"
      expect(result).toEqual(expected)
    }

    for (const validRating of validRatings) {
      const result = cinema.addMovie("Film " + validRating, validRating, "2:08")
      expect(result).toBeUndefined()
    }
  })

  it("returns error trying to create film with invalid durations", () => {
    const invalidDurations = ["0:00", "abc", "4", "1:61", "1:1"]

    for (const duration of invalidDurations) {
      cinema = new Cinema()
      const result = cinema.addMovie("Film", "12", duration)
      const expected = "Invalid duration"
      expect(result).withContext(duration).toEqual(expected)
    }
  })

  it("returns error trying to schedule showing when film does not exist", () => {
    cinema.addMovie("Film1", "12", "1:20")
    cinema.addScreen("Screen #1", 20)
    const expected = "Invalid film"
    const result = cinema.addShowing("Film doesnt exist!", "Screen #1", "10:00")
    expect(result).toBe(expected)
  })

  it("returns error trying to schedule showing when screen does not exist", () => {
    cinema.addMovie("Film1", "12", "1:20")
    cinema.addScreen("Screen #1", 20)
    const expected = "Invalid screen"
    const result = cinema.addShowing("Film1", "Screen Doesnt exist", "10:00")
    expect(result).toBe(expected)
  })

  it("schedules single film", () => {
    cinema.addMovie("Film1", "12", "1:20")
    cinema.addScreen("Screen #1", 20)
    const expected = {
      "Film1" : [
        "Screen #1 Film1 (12) 10:00 - 11:40"
      ]
    }
    
    cinema.addShowing("Film1", "Screen #1", "10:00")

    const result = cinema.allShowings()
    expect(result).toEqual(expected)
  })

  it("schedules same film on same screen", () => {
    cinema.addMovie("Film1", "12", "1:20")
    cinema.addScreen("Screen #1", 20)

    const expected = {
      "Film1" : [
        "Screen #1 Film1 (12) 10:00 - 11:40",
        "Screen #1 Film1 (12) 12:10 - 13:50"
      ]
    }
    
    cinema.addShowing("Film1", "Screen #1", "10:00")
    cinema.addShowing("Film1", "Screen #1", "12:10")

    const result = cinema.allShowings()
    expect(result).toEqual(expected)
  })

  it("schedules same film on multiple screens", () => {
    cinema.addMovie("Film1", "12", "1:20")
    cinema.addScreen("Screen #1", 20)
    cinema.addScreen("Screen #2", 20)

    const expected = {
      "Film1" : [
        "Screen #1 Film1 (12) 10:00 - 11:40",
        "Screen #2 Film1 (12) 10:00 - 11:40"
      ]
    }
    
    cinema.addShowing("Film1", "Screen #1", "10:00")
    cinema.addShowing("Film1", "Screen #2", "10:00")

    const result = cinema.allShowings()
    expect(result).toEqual(expected)
  })

  it("schedules multiple films on multiple screens", () => {
    cinema.addMovie("Film1", "12", "1:20")
    cinema.addMovie("Film2", "15", "2:00")
    cinema.addScreen("Screen #1", 20)
    cinema.addScreen("Screen #2", 20)

    const expected = {
      "Film1" : [
        "Screen #1 Film1 (12) 10:00 - 11:40",
        "Screen #2 Film1 (12) 12:00 - 13:40"
      ],
      "Film2" : [
        "Screen #1 Film2 (15) 12:00 - 14:20",
        "Screen #2 Film2 (15) 09:00 - 11:20"
      ]
    }
    
    cinema.addShowing("Film1", "Screen #1", "10:00")
    cinema.addShowing("Film1", "Screen #2", "12:00")

    cinema.addShowing("Film2", "Screen #1", "12:00")
    cinema.addShowing("Film2", "Screen #2", "09:00")
    

    const result = cinema.allShowings()
    expect(result).toEqual(expected)
  })

  it("returns error when film screening overlaps start", () => {
    cinema.addMovie("Film1", "12", "1:00")
    cinema.addScreen("Screen #1", 20)

    cinema.addShowing("Film1", "Screen #1", "10:00")
    const result = cinema.addShowing("Film1", "Screen #1", "11:00")
    const expected = 'Time unavailable'
    expect(result).toEqual(expected)
  })

  it("returns error when film screening overlaps end", () => {
    cinema.addMovie("Film1", "12", "1:00")
    cinema.addScreen("Screen #1", 20)

    cinema.addShowing("Film1", "Screen #1", "10:00")
    const result = cinema.addShowing("Film1", "Screen #1", "09:10")
    const expected = 'Time unavailable'
    expect(result).toEqual(expected)
  })

  it("returns error when film screening overlaps all", () => {
    cinema.addMovie("Film1", "12", "1:00")
    cinema.addMovie("Film2", "12", "4:00")
    cinema.addScreen("Screen #1", 20)

    cinema.addShowing("Film1", "Screen #1", "10:00")
    const result = cinema.addShowing("Film2", "Screen #1", "08:30")
    const expected = 'Time unavailable'
    expect(result).toEqual(expected)
  })
})
