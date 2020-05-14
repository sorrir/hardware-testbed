import {
    createMQTTReceiveComponent,
    createMQTTReceiveComponentState,
    createMQTTSendComponent, createMQTTSendComponentState
} from "sorrir-framework/dist/util/mqtt";
import {signalControllerPorts, barrierControllerPorts} from "./MqttPorts";
import {params} from "../params";
import {Event} from "sorrir-framework/dist";
import {EventTypes, MQTTPublishPayload} from "./events";


const mqttButtonTopic = "sorrir/button-pressed";
const mqttBarrierControllerName = "mqtt-button-receiver"
const mqttSignalTopic = "sorrir/signal-update";
const mqttSignalControllerName = "mqtt-signal-publisher";

const opts = { username: params.mqttUser, password: params.mqttPw};

const decode = (payload: string) => {
    if (payload === "BUTTON_UP_PRESSED" || payload === "BUTTON_DOWN_PRESSED") {
        return {port: barrierControllerPorts.TO_BARRIER, type: payload };
    }
}

const encode = (event : Event<EventTypes, any, MQTTPublishPayload>) : [string, string] | undefined => {
    switch (event.type) {
        case EventTypes.LED_GREEN:
        case EventTypes.LED_RED:      return [event.type.valueOf(), event.payload?.status ? "1" : "0"];

        case EventTypes.DISPLAY:      return [event.type.valueOf(), event.payload?.freeSpaces ? event.payload?.freeSpaces.toString() : "0"];
        default:                      return undefined;
    }
}

export const barrierController = createMQTTReceiveComponent(mqttBarrierControllerName, barrierControllerPorts.TO_BARRIER);
export const barrierControllerState = createMQTTReceiveComponentState(mqttButtonTopic, params.mqttURL, {...opts, clientId: mqttBarrierControllerName}, decode);

export const signalController = createMQTTSendComponent(mqttSignalControllerName, signalControllerPorts.FROM_PARKING_MANAGEMENT);
export const signalControllerState = createMQTTSendComponentState(mqttSignalTopic, params.mqttURL, {...opts, clientId: mqttSignalControllerName}, encode);

