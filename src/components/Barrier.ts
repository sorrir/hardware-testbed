import {Component, createStatemachineComponent, StateMachine, StateMachineState} from "sorrir-framework/dist";
import {EventTypes} from "./events";

enum BarrierStates {
    IDLE = "IDLE",
    CAR_ENTRY = "CAR_ENTRY"
}

export enum BarrierPorts {
    TO_PARKING_MANAGEMENT = "TO_PARKING_MANAGEMENT",
    FROM_BARRIER_CONTROLLER = "FROM_BARRIER_CONTROLLER"
}

type BarrierState = {
    lastAction : number;
}

const sm : StateMachine<BarrierStates, BarrierState, EventTypes, BarrierPorts> = {
    transitions: [
        {
            sourceState: BarrierStates.IDLE,
            targetState: BarrierStates.CAR_ENTRY,
            event: [EventTypes.BUTTON_DOWN_PRESSED, BarrierPorts.FROM_BARRIER_CONTROLLER],
            action: (myState, raiseEvent, event) => {
                raiseEvent({ type: EventTypes.CAR_OUT, port: BarrierPorts.TO_PARKING_MANAGEMENT});
                return { lastAction: Date.now() };
            }
        },
        {
            sourceState: BarrierStates.IDLE,
            targetState: BarrierStates.CAR_ENTRY,
            event: [EventTypes.BUTTON_UP_PRESSED, BarrierPorts.FROM_BARRIER_CONTROLLER],
            action: (myState, raiseEvent, event) => {
                raiseEvent({ type: EventTypes.CAR_IN, port: BarrierPorts.TO_PARKING_MANAGEMENT});
                console.log(myState);
                return { lastAction: Date.now() };
            }
        },
        {
            sourceState: BarrierStates.CAR_ENTRY,
            targetState: BarrierStates.IDLE,
            condition: myState => myState.lastAction + 1000 <= Date.now(),
            action: myState => {
                console.log(myState);
                return myState;
            }
        }
    ]
};

export const barrier:Component<EventTypes, BarrierPorts> = createStatemachineComponent(
    [BarrierPorts.TO_PARKING_MANAGEMENT, BarrierPorts.FROM_BARRIER_CONTROLLER],
    sm,
    "barrier",
);

export const barrier_startState:StateMachineState<BarrierStates, BarrierState, EventTypes, BarrierPorts> = {
    state: {
        fsm: BarrierStates.IDLE,
        my: {
            lastAction: 0
        }
    },
    events: []
};