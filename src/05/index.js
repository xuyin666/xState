import { createMachine, assign, interpret } from 'xstate';

const elBox = document.querySelector('#box');
const elBody = document.body;

console.log(
  assign({
    name: 'David'
  })
)

const machine = createMachine({
  initial: 'idle',
 context: {
     x: 0,
     y: 0,
     dx: 0,
     dy: 0,
     px: 0,
     py: 0,
 },
  states: {
    idle: {
      on: {
        mousedown: {
          actions: assign({
            px: (context, event) => event.clientX,
            py: (context, event) => event.clientY,
          }),
          target: 'dragging',
        },
      },
    },
    dragging: {
      on: {
        mousemove: {
          actions: assign({
            dx: (context, event) =>{
              return event.clientX - context.px;
            },
            dy: (context, event) => {
              return event.clientY - context.py;
            }
          })
          // Assign the delta
          // ...
          // (no target!)
        },
        mouseup: {
          actions: assign({
            x: (context) => {
              return context.x + context.dx;
            },
            y: (context) => {
              return context.y + context.dy;
            },
            dx: 0,
            dy: 0,
            px: 0,
            py: 0
          }),
          // Assign the position
          target: 'idle',
        },
        'keyup.escape': {
          target: 'idle',
          actions: assign({
              dx: 0,
              dy: 0,
              px: 0,
              py: 0,
          }),
        }
      },
    },
  },
});


// interpret machine: creer une instance du modele machine
const service = interpret(machine);


// 
service.onTransition((state) => {
  if (state.changed) {
    console.log(state.context);
    console.log('Hello');

    
    elBox.dataset.state = state.value;

    elBox.style.setProperty('--dx', state.context.dx);
    elBox.style.setProperty('--dy', state.context.dy);
    elBox.style.setProperty('--x', state.context.x);
    elBox.style.setProperty('--y', state.context.y);
  }
});

service.start();


// service.send est la meme chose que (event) => service.send(event) egalement c'est egale a service.send({target: blabla}) ;
elBox.addEventListener('mousedown', service.send);
elBody.addEventListener('mousemove', service.send);
elBody.addEventListener('mouseup',service.send);

// Add event listeners for:
// - mousedown on elBox
// - mousemove on elBody
// - mouseup on elBody

elBody.addEventListener('keyup', (e) => {
  if (e.key === 'Escape') {
     service.send({
       type: 'keyup.escape',
     });
  }
});