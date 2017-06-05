/**
 * author:  hyerim k
 *   note:  external sensor modules
 *          of sleep monitoring service 'croissant'
 */

const gpio = require('wiring-pi')
const request = require('../lib/request')

let sleepMode = 'off'
let securityMode = 'off'

const fire = {
  //member variables
  PIN: 23,

  //function
  init(){
    gpio.pinMode( this.PIN, gpio.INPUT )
  },
  read() {
    const data = gpio.digitalRead( this.PIN )
    if( !data ){
      buzzer_act.write()
    }
    return data
  }
}

const buzzer_act = {
  //member variables
  PIN: 1,
  time: 1500,

  //function
  init() {
    gpio.pinMode( this.PIN, gpio.OUTPUT )
  },
  write() {
    gpio.digitalWrite( this.PIN, 1 )
    gpio.delay( this.time )
    gpio.digitalWrite( this.PIN, 0 )
  },

}

const buzzer_pas = {
  //member variables
  PIN: 25,
  time: 200,

  //function
  init() {
    gpio.pinMode( this.PIN, gpio.OUTPUT )
  },
  write() {
    gpio.digitalWrite( this.PIN, 1 )
    gpio.delay( this.time )
    gpio.digitalWrite( this.PIN, 0 )
  },
}

const button = {
  //member variables
  PIN: 4,

  //function
  init() {
	  gpio.pinMode( this.PIN, gpio.INPUT )
    console.log("button initated")
  },
  readStart() {
    setInterval( () => {
      const data = gpio.digitalRead( this.PIN )
      if( !data ){
        sleepMode = sleepMode=='on' ? 'off'  : 'on'
      	console.log(sleepMode)
      	securityMode = sleepMode

      	request('post', `/sleep/${sleepMode}`)
      	buzzer_pas.write()
        console.log("button pushed!")
        if(sleepMode=='on'){
      	  led.on()
      	}
      	else {
      	  led.off()
      	}

      }
    }, 100)
  }

}

const led = {
  //member variables
  RED: 23,
  GREEN: 24,
  BLUE: 25,

  //function
  init() {
    gpio.pinMode( this.RED, gpio.OUTPUT )
    gpio.pinMode( this.GREEN, gpio.OUTPUT )
    gpio.pinMode( this.BLUE, gpio.OUTPUT )
    console.log("led initiated")
  },
  quit() {
    gpio.digitalWrite(this.RED, 0)
    gpio.digitalWrite(this.GREEN, 0)
    gpio.digitalWrite(this.BLUE, 0)
  },
  off() {
    gpio.digitalWrite(this.RED, 1)
    gpio.digitalWrite(this.GREEN, 0)
    gpio.digitalWrite(this.BLUE, 0)
  },
  on() {
    gpio.digitalWrite(this.RED, 0)
    gpio.digitalWrite(this.GREEN, 1)
    gpio.digitalWrite(this.BLUE, 0)
  },
}

const light = {
  //member variables
  PIN: 30,
  state: 1,

  //function
  init(){
    gpio.pinMode( this.PIN, gpio.INPUT )
  },
  read() {
    // 0: bright, 1: dark
    const data = gpio.digitalRead( this.PIN )
    console.log( data )

    if( data != this.state ){
      this.state = this.state==1 ? 0 : 1

      if( sleepMode == 'on' ){
        request( 'put', '/sleep', {
          light: state ? 'dark' : 'bright',
        })
      }
    }
  }
}

const door = {
  //member variables
  PIN: 20,
  state: 0,

  //function
  init() {
    gpio.pinMode( this.PIN, gpio.INPUT )
  },
  read() {
    // 0: door close, 1: door open
    const data = gpio.digitalRead( this.PIN )

    if( data != this.state ){
      this.state = this.state==1 ? 0 : 1

      request( 'put', '/security', {
        door: state ? 'close' : 'open',
      })
    }
  }
}

module.exports = {
  setModeStatus(sleep, security) {
    sleepMode = sleep
    securityMode = security
  },

  init() {
    gpio.wiringPiSetup()
    console.log(`sleepMode = ${sleepMode}`)
    fire.init()
    buzzer_pas.init()
    buzzer_act.init()
    button.init()
    led.init()

    button.readStart()
    setInterval( () => {
      if( sleepMode && securityMode ) {
        fire.read()
      }
    }, 500)
  },
}


gpio.wiringPiSetup()
button.init()
led.init()

button.readStart()
