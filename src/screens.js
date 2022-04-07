class Screens {
//   constructor(name, capacity) {
//     this.name = name
//     this.capacity = capacity
//   }

  screenCapacity(capacity) {
    if (capacity > 100) {
      return false
    }
    return true
  }

  createScreen(screenName, capacity) {
    const newScreen = {
      name: screenName,
      capacity: capacity,
      showings: []
    }
    return newScreen
  }

  screenExists(screens, screenName) {
    let currentScreen = null
    for (let i = 0; i < screens.length; i++) {
      if (screens[i].name === screenName) {
        currentScreen = screens[i]
      }
    }
    if (currentScreen === null) {
      return false
    }
    return true
  }
}

module.exports = Screens
