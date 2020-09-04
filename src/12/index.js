import { createMachine, assign, interpret, send } from 'xstate';

const elBox = document.querySelector('#box');

const randomFetch = () => {
  console.log('Fetching!!')
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (Math.random() < 0.5) {
        rej('Fetch failed!');
      } else {
        res('Fetch succeeded!');
      }
    }, 2000);
  });
};

const machine = createMachine({
  initial: 'idle',
  states: {
    idle: {
      on: {
        FETCH: 'pending',
      },
    },
    pending: {
      on: {
        I_AM_DONE: 'resolved',
        CANCEL: 'idle', 
        SEND_IT_ALREADY: {
          actions: send(
            {
              type: 'SEND_IT_ALREADY',
            },
            {
              to: 'child',
            }
          )
        }
      },
      invoke: {
        id: 'child',
        // Invoke your promise here.
        // The `src` should be a function that returns the source.
        src: (context, event) => (sendBack, receive) => {
          receive((event) => {
            if(event.type === 'SEND_IT_ALREADY') {
              sendBack({
                type: 'I_AM_DONE'
              });
            }
          });
        },
      },
    },
    resolved: {
      on: {
        FETCH: 'pending',
      }
      // Add a transition to fetch again
    },
    rejected: {
      on: {
        FETCH: 'pending',
      }
      // Add a transition to fetch again
    },
  },
});

const service = interpret(machine);

service.onTransition((state) => {
  elBox.dataset.state = state.toStrings().join(' ');

  console.log(state);
});

service.start();

elBox.addEventListener('click', (event) => {
  service.send('FETCH');
});


const elCancel = document.querySelector('#cancel');

elCancel.addEventListener('click', (event) => {
  service.send('SEND_IT_ALREADY');
});