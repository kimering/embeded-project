
const util = require('../lib/util')
const request = require('../lib/request')

let modeState = 'off';
let prevValue = 0;
let Count = 0;
let tossAndTurnData = 0;
let oldValue = 0;
let alpha = 0.75; 
let period = 100; //측정 주기.
let heartbeatCount = 0;
let max = 0;

const gpio = require('wiring-pi')
const mcpadc = require('mcp-adc')
const BALLTILT = 29
const TOUCHED = 28
const HEARTBEAT = new mcpadc.Mcp3208()
const CS_MCP3208 = 10
const SPI_CHANNEL = 0
const SPI_SPEED = 1000000

const sleepData = {
	heartBeat: 0,
	turn: 0
}

//const util = require()

gpio.wiringPiSetup()
gpio.wiringPiSPISetup(SPI_CHANNEL, SPI_SPEED)
gpio.pinMode(BALLTILT, gpio.INPUT)
gpio.pinMode(TOUCHED, gpio.INPUT)
gpio.pinMode(CS_MCP3208, gpio.OUTPUT)
/*setInterval(() => {
    const data = gpio.digitalRead(BALLTILT)
console.log(data)
}, 500)*/


 setInterval(TossAndTurn, 500)
 setInterval(SecurityRequest, 100)
 setInterval(SetServer, 1000)
 setInterval(HeartBeatInfo, 100)
 setInterval(GetServerPerMinute, 60000)

function TossAndTurn() {
    if(modeState == 'off')
	    return

    prevValue = tossAndTurnData
    const data = gpio.digitalRead(BALLTILT)
    tossAndTurnData = data


    if(prevValue != tossAndTurnData)
        Count++
    console.log('trunCount : ' +  Count)

}

function SecurityRequest() {
    const data = gpio.digitalRead(TOUCHED)

    if(data)
    {
        if(modeState == 'off')
        {
	//	console.log(modeState)
            request('post', '/security/on')
//	    console.log('securityState : ' + modeState)
	}
        else if(modeState == 'on') {
	//	console.log(modeSt`ate)
            request('post', '/security/off')
 //           console.log('securityState : ' + modeState)
	}
    }
    
}

function HeartBeatInfo()
{
	let prevCount = heartbeatCount
    HEARTBEAT.readRawValue(SPI_CHANNEL, function(rawValue) {
        const value = alpha * oldValue + (1 - alpha) * rawValue;

	if(max < value)
	{
	max = value
	}

	if(10 < max - value)
	{
	heartbeatCount++
	max = 0;
	}
//        console.log(value)
       // console.log('RAW_VALUE : ' + rawValue);
        oldValue = value
    })
	if(prevCount != heartbeatCount)
		console.log('HeartBeatCount : ' + heartbeatCount)
}

function SetServer() {
	request('get', '/security')
	.then(onoff => {
		modeState = onoff
		console.log(modeState)
	})
}

function GetServerPerMinute()
{
	sleepData.heartBeat = heartbeatCount
	sleepData.turn = Count
	request('put', '/sleep', sleepData)
	heartbeatCount = 0
	Count = 0
       //console.log('HPM : ' + heartbeatCount)
}

///////////////////////////////////////////////////////
