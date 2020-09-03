import { createMachine } from 'xstate';

const elBox = document.querySelector('#box');

const machine = createMachine({
  initial: 'inactive',
  states: {
    inactive: {
      on: {
        CLICK: 'active'
      }
    },
    active: {
      on: {
        CLICK: 'inactive',
      }
    }
  }
});

// Change this to the initial state
let currentState = machine.initial;

function send(event) {
  // Determine and update the `currentState`

  currentState = machine.transition(currentState, event);

  console.log(currentState);
  elBox.dataset.state = currentState.value;
}

elBox.addEventListener('click', () => {
  send('CLICK');
});
