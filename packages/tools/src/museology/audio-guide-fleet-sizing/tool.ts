import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly simultaneousTourDeviceDemand: number;
  readonly callerReadyDeviceReserve: number;
  readonly tourRuntimeHours: number;
  readonly deviceRechargeHours: number;
  readonly resetHours: number;
}>;
export type Output = Readonly<{
  readonly modelChargingPipelineDevices: number;
  readonly minimumModeledFleetDevices: number;
}>;
const inputFields = [
  {
    id: "simultaneousTourDeviceDemand",
    label: "Simultaneous tour device demand",
    kind: "integer",
  },
  {
    id: "callerReadyDeviceReserve",
    label: "Caller ready device reserve",
    kind: "integer",
  },
  { id: "tourRuntimeHours", label: "Tour runtime hours", kind: "number" },
  { id: "deviceRechargeHours", label: "Device recharge hours", kind: "number" },
  { id: "resetHours", label: "Reset hours", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.tourRuntimeHours, "tourRuntimeHours");
  nonnegative(input.deviceRechargeHours, "deviceRechargeHours");
  nonnegative(input.resetHours, "resetHours");
  count(input.simultaneousTourDeviceDemand, "simultaneousTourDeviceDemand");
  count(input.callerReadyDeviceReserve, "callerReadyDeviceReserve");
  const pipeline = safeCeil(
    (input.simultaneousTourDeviceDemand *
      (input.deviceRechargeHours + input.resetHours)) /
      input.tourRuntimeHours,
    "pipeline",
  );
  return {
    modelChargingPipelineDevices: pipeline,
    minimumModeledFleetDevices: count(
      input.simultaneousTourDeviceDemand +
        input.callerReadyDeviceReserve +
        pipeline,
      "fleet",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  simultaneousTourDeviceDemand: 10,
  callerReadyDeviceReserve: 2,
  tourRuntimeHours: 2,
  deviceRechargeHours: 3,
  resetHours: 0.5,
} satisfies Input;
export const exampleOutput = {
  modelChargingPipelineDevices: 18,
  minimumModeledFleetDevices: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/audio-guide-fleet-sizing",
  title: "Audio Guide Device Charge Cycle Fleet Sizing Calculator",
  description:
    "Budget steady continuous tour-device demand plus recharge/reset pipeline and caller ready reserve; assumes stable turnover and enough chargers, not exact peak queue sizing or battery life guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelChargingPipelineDevices",
      label: "Model charging pipeline devices",
      kind: "number",
    },
    {
      id: "minimumModeledFleetDevices",
      label: "Minimum modeled fleet devices",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      simultaneousTourDeviceDemand:
        value.simultaneousTourDeviceDemand as number,
      callerReadyDeviceReserve: value.callerReadyDeviceReserve as number,
      tourRuntimeHours: value.tourRuntimeHours as number,
      deviceRechargeHours: value.deviceRechargeHours as number,
      resetHours: value.resetHours as number,
    }),
});
export const run = tool.execute;
export default tool;
