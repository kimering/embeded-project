
const util = require('../lib/util')
const send = require('../lib/send')

console.log(util.rand(0, 1))

let OnoFF; //C#�� var 

/*if(OnOff == true)
    send('/event/fire')
if(OnOff == false)
    send('/event/fire')*/

send('/security/on') //on ��û ����. off�� on�� off��.

let OnOff = send('/security') // ���� ���¸� ����.

if (OnOff == true) //OnOff�� �Ǵ� ���θ� ����.
{
    send('/security/off')
}

let prevValue = 0;
let Count = 0;


/*const tossAndTurnData = {
    tossCount: 0
}*/

const gpio = require('wiring-pi')
const BALLTILT = 29
const TOUCHED = 28
//const util = require()

gpio.wiringPiSetup()
gpio.pinMode(BALLTILT, gpio.INPUT)
gpio.pinMode(TOUCHED, gpio.INPUT)
/*setInterval(() => {
    const data = gpio.digitalRead(BALLTILT)
console.log(data)
}, 500)*/

setInterval(TossAndTurn, 500)
setInterval(SecurityRequest, 500)

function TossAndTurn() {
    prevValue = data
    const data = gpio.digitalRead(BALLTILT)

    if(prevValue != data)
        Count++
    //console.log(data)
}

function SecurityRequest() {
    const data = gpio.digitalRead(TOUCHED)

    if(data)
    {
        if("���� ��")
        {
            send('/security/off')
        }
        else {
            send('/security/on')
        }
    }
}


///////////////////////////////////////////////////////
