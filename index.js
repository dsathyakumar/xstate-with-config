const {createMachine, assign, interpret} = require('xstate');
// import { createMachine, interpret, assign } from 'xstate';

const promiseMachine = createMachine({
  id: 'promise',
  initial: 'pending',
  context: {
      data: "pending",
      hello: ""
  },
  states: {
    pending: {
      on: {
        RESOLVE: { target: 'resolved', actions: ["updateSuccess"] },
        REJECT: { target: 'rejected', actions: ["updateFail", "updateHello"] }
      }
    },
    resolved: {
      type: 'final'
    },
    rejected: {
      type: 'final'
    }
  }
}, {
    actions: {
        updateSuccess: assign((ctx, evt) => ({
            data: "success"
        })),
        updateFail:  assign((ctx, evt) => ({
            data: "fail"
        }))
    }
});
// console.log(promiseMachine)
promiseMachine.withConfig({
    actions: {
        updateSuccess: assign((ctx, evt) => ({
            data: "done"
        })),
        updateFail: assign((ctx, evt) => ({
            data: "rejected"
        })),
        updateHello: assign((ctx, evt) => ({
            hello: "Hi!!!!!"
        }))
    }
})
const promiseService = interpret(promiseMachine)
.onTransition((state) => {
   console.log(state.value);
  console.log(state.context);
});

// Start the service
promiseService.start();
// => 'pending'

promiseService.send({ type: 'REJECT' });
// => 'resolved'