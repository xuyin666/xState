const elBox = document.querySelector('#box');

// Pure function that returns the next state,
// given the current state and sent event


const machine = {
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
}

transition = (state, event) => {
      return machine.states[state] ?.
        on?.[event] || state;
}

// Keep track of your current state
let currentState = 'inactive';

function send(event) {
  // Determine the next value of `currentState`
  const nextState = transition(currentState, event);
  currentState = nextState;
  console.log(nextState);

  elBox.dataset.state = currentState;
}

elBox.addEventListener('click', () => {
  // send a click event
  send('CLICK');
});
