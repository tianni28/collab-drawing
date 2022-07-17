// TODO: add reconnecting websockets

let ws_host = 'localhost';
let ws_port = '3000';

const ws = new WebSocket('ws://' + ws_host + ':' + ws_port + '/ws')

ws.addEventListener('open', () => {
    console.log('[Client] Connection to websocket server was opened');
    ws.send('Hello  this is a message from a client');
})

ws.addEventListener('message', (e) => {
    console.log(e.data);
    data = JSON.parse(e.data);

    console.log('[Client] Message received: ' + data.x + ' ' + data.y + ' ');

    if (data.event == 'mouseDown') {
        ctx.moveTo(data.x, data.y);
    }
    if (data.event == 'mouseUp') {

    }
    if (data.event == 'mouseDraw') {
        ctx.lineTo(data.x, data.y);
        ctx.stroke();
    }

})

ws.addEventListener('close', () => {
    console.log('Client connection clsoed');
})

ws.onerror = (err) => {
    if (err.code == 'EHOSTDOWN') {
        console.log('client error server down');
    } else {
        console.log(err.code);
    }
}


let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let isDrawing;

canvas.style.background = ("red");


// event listeners

if (window.PointerEvent) {

    console.log('weeee pointesr');

    canvas.addEventListener('pointermove', function (e) {
        if (e.pressure > 0) {

            console.log("pointer move")

            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
            data = {
                event: 'mouseDraw',
                x: e.clientX,
                y: e.clientY,
            }
            ws.send(JSON.stringify(data))
            console.log(e.pressure);
        } else {

        }

    });

    canvas.addEventListener('pointerleave', function (e) {
        console.log("pointer leave")

        isDrawing = false;
        data = {
            event: 'mouseUp',
        }
        ws.send(JSON.stringify(data))
    })

    canvas.addEventListener('pointerdown', function (e) {
        console.log("pointer downwww")

        isDrawing = true;
        ctx.moveTo(e.clientX, e.clientY);
        data = {
            event: 'mouseDown',
            x: e.clientX,
            y: e.clientY,
        }
        ws.send(JSON.stringify(data))
        console.log(JSON.stringify(data));
        console.log(e.pressure);
    })
    canvas.addEventListener('pointermove', function (e) {
        if (isDrawing) {

            console.log("pointer move")

            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
            data = {
                event: 'mouseDraw',
                x: e.clientX,
                y: e.clientY,
            }
            ws.send(JSON.stringify(data))
            console.log(e.pressure);
        }
    });

    canvas.addEventListener('pointerup', function () {

        console.log("pointer up")

        isDrawing = false;
        data = {
            event: 'mouseUp',
        }
        ws.send(JSON.stringify(data))
    });
}/*
else {
    // traditional mouse

    canvas.onmousedown = function (e) {
        isDrawing = true;
        ctx.moveTo(e.clientX, e.clientY);
        data = {
            event: 'mouseDown',
            x: e.clientX,
            y: e.clientY,
        }
        ws.send(JSON.stringify(data))
        console.log(JSON.stringify(data));
    }

    canvas.onmousemove = function (e) {
        if (isDrawing) {
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
            data = {
                event: 'mouseDraw',
                x: e.clientX,
                y: e.clientY,
            }
            ws.send(JSON.stringify(data))
        }
    };

    canvas.onmouseup = function () {
        isDrawing = false;
        data = {
            event: 'mouseUp',
        }
        ws.send(JSON.stringify(data))
    };

}*/