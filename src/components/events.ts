import {Event} from "sorrir-framework/dist";

export enum EventTypes {
    BUTTON_UP_PRESSED = "BUTTON_UP_PRESSED",
    BUTTON_DOWN_PRESSED = "BUTTON_DOWN_PRESSED",
    CAR_IN = "CAR_IN",
    CAR_OUT = "CAR_OUT",
    LED_RED = "LED_RED",
    LED_GREEN = "LED_GREEN",
    DISPLAY = "DISPLAY"
}

export interface MQTTPublishPayload {
    status? : boolean,
    freeSpaces? : number
}