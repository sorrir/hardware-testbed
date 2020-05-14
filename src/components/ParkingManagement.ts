import {Component, createStatemachineComponent, Event, StateMachine, StateMachineState} from "sorrir-framework/dist";
import {EventTypes, MQTTPublishPayload} from "./events";

// The states the ParkingManagement's state machine can be
enum ParkingManagementStates {
    AVAILABLE = "AVAILABLE",
    FULL = "FULL"
}

// Ports of ParkingManagement to other components.
// Naming convention: <FROM/TO>_<OTHER_COMPONENT_NAME>
export enum ParkingManagementPorts {
    FROM_BARRIER = "FROM_BARRIER",
    TO_SIGNAL_CONTROLLER = "TO_SIGNAL_CONTROLLER"
}

// In contrast to ParkingManagementStates (plural), this is the internal state or data state of the component.
// You can define entries of your choice that are passed from step to step
type ParkingManagementState = {
    readonly freeParkingSpaces : number;
    readonly totalParkingSpaces: number;
}

// The component's state machine is defined by its transitions
const sm : StateMachine<ParkingManagementStates, ParkingManagementState, EventTypes, ParkingManagementPorts, MQTTPublishPayload> = {
    transitions: [
        {
            sourceState: ParkingManagementStates.AVAILABLE,
            targetState: ParkingManagementStates.AVAILABLE,
            event: [EventTypes.CAR_IN, ParkingManagementPorts.FROM_BARRIER],
            condition: myState => myState.freeParkingSpaces - 1 > 0,
            action: (myState, raiseEvent) => {
                const updatedFreeParkingSpaces = myState.freeParkingSpaces-1;
                raiseEvent({type: EventTypes.LED_RED, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {status: false}});
                raiseEvent({type: EventTypes.LED_GREEN, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {status: true}});
                raiseEvent({type: EventTypes.DISPLAY, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {freeSpaces: updatedFreeParkingSpaces}});
                return {
                    freeParkingSpaces: updatedFreeParkingSpaces,
                    totalParkingSpaces: myState.totalParkingSpaces
                };
            }
        },
        {
            sourceState: ParkingManagementStates.AVAILABLE,
            targetState: ParkingManagementStates.FULL,
            event: [EventTypes.CAR_IN, ParkingManagementPorts.FROM_BARRIER],
            condition: myState => myState.freeParkingSpaces - 1 == 0,
            action: (myState, raiseEvent) => {
                const updatedFreeParkingSpaces = myState.freeParkingSpaces-1;


                raiseEvent({type: EventTypes.LED_RED, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {status: true}});
                raiseEvent({type: EventTypes.LED_GREEN, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {status: false}});
                raiseEvent({type: EventTypes.DISPLAY, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {freeSpaces: updatedFreeParkingSpaces}});

                return {
                    freeParkingSpaces: updatedFreeParkingSpaces,
                    totalParkingSpaces: myState.totalParkingSpaces
                };
            }
        },
        {
            sourceState: ParkingManagementStates.FULL,
            targetState: ParkingManagementStates.AVAILABLE,
            event: [EventTypes.CAR_OUT, ParkingManagementPorts.FROM_BARRIER],
            action: (myState, raiseEvent) => {
                const updatedFreeParkingSpaces = myState.freeParkingSpaces+1;

                raiseEvent({type: EventTypes.LED_RED, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {status: false}});
                raiseEvent({type: EventTypes.LED_GREEN, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {status: true}});
                raiseEvent({type: EventTypes.DISPLAY, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {freeSpaces: updatedFreeParkingSpaces}});

                return {
                    freeParkingSpaces: updatedFreeParkingSpaces,
                    totalParkingSpaces: myState.totalParkingSpaces
                };
            }
        },
        {
            sourceState: ParkingManagementStates.AVAILABLE,
            targetState: ParkingManagementStates.AVAILABLE,
            event: [EventTypes.CAR_OUT, ParkingManagementPorts.FROM_BARRIER],
            condition: myState => myState.freeParkingSpaces + 1 <=  myState.totalParkingSpaces,
            action: (myState, raiseEvent) => {
                const updatedFreeParkingSpaces = myState.freeParkingSpaces+1;

                raiseEvent({type: EventTypes.LED_RED, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {status: false}});
                raiseEvent({type: EventTypes.LED_GREEN, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {status: true}});
                raiseEvent({type: EventTypes.DISPLAY, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {freeSpaces: updatedFreeParkingSpaces}});

                return {
                    freeParkingSpaces: updatedFreeParkingSpaces,
                    totalParkingSpaces: myState.totalParkingSpaces
                };
            }
        },
    ]
};

export const parkingManagement:Component<EventTypes, ParkingManagementPorts, MQTTPublishPayload> = createStatemachineComponent(
    [ParkingManagementPorts.FROM_BARRIER, ParkingManagementPorts.TO_SIGNAL_CONTROLLER],
    sm,
    "parkingManagement"
);

export const parkingManagement_startState:StateMachineState<ParkingManagementStates, ParkingManagementState, EventTypes, ParkingManagementPorts, MQTTPublishPayload> = {
    state: {
        fsm: ParkingManagementStates.AVAILABLE,
        my: {
            totalParkingSpaces: 5,
            freeParkingSpaces: 5
        }
    },
    events: [
        {type: EventTypes.LED_RED, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {status: false}},
        {type: EventTypes.LED_GREEN, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {status: true}},
        {type: EventTypes.DISPLAY, port: ParkingManagementPorts.TO_SIGNAL_CONTROLLER, payload: {freeSpaces: 5}},
    ]
};