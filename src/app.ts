import {Configuration, configurationStep, createConnection} from "sorrir-framework/dist";
import {barrier, barrier_startState, BarrierPorts} from "./components/Barrier";
import {parkingManagement, parkingManagement_startState, ParkingManagementPorts} from "./components/ParkingManagement";
import {signalControllerPorts, barrierControllerPorts} from "./components/MqttPorts";
import {
    signalController,
    signalControllerState,
    barrierController,
    barrierControllerState
} from "./components/MqttComponents";
import {params} from "./params";


console.log("Hello Parkhaus");


const config:Configuration = {
  components: [barrier, parkingManagement, barrierController, signalController],
  connections: [
      createConnection(barrierController, barrierControllerPorts.TO_BARRIER, barrier, BarrierPorts.FROM_BARRIER_CONTROLLER),
      createConnection(barrier, BarrierPorts.TO_PARKING_MANAGEMENT, parkingManagement, ParkingManagementPorts.FROM_BARRIER),
      createConnection(parkingManagement, ParkingManagementPorts.TO_SIGNAL_CONTROLLER, signalController, signalControllerPorts.FROM_PARKING_MANAGEMENT)
  ]
};

let confState = {
  componentState: new Map([
      [barrierController, barrierControllerState] as [any, any],
      [barrier, barrier_startState] as [any, any],
      [parkingManagement, parkingManagement_startState] as [any, any],
      [signalController, signalControllerState] as [any, any]
  ])
};

setInterval(args => {
    confState = configurationStep(config, confState);
}, params.tickRateInMilliSec);