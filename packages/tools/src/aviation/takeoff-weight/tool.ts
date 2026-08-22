import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TakeoffWeightInput = {
  readonly fuelWeightLb: number;
  readonly payloadLb: number;
  readonly zeroFuelWeightLb?: number;
};

export type TakeoffWeightOutput = {
  readonly takeoffWeightLb: number;
};

export const takeoffWeightExample = {
  input: {
    fuelWeightLb: 360,
    payloadLb: 500,
    zeroFuelWeightLb: 2100,
  },
  output: { takeoffWeightLb: 2460 },
} satisfies ToolExample<TakeoffWeightInput, TakeoffWeightOutput>;

export const calculateTakeoffWeight = (
  input: TakeoffWeightInput,
): TakeoffWeightOutput => ({
  takeoffWeightLb:
    (input.zeroFuelWeightLb ?? input.payloadLb) + input.fuelWeightLb,
});

export const takeoffWeightTool = createSimpleTool({
  calculate: (input) =>
    calculateTakeoffWeight(input as unknown as TakeoffWeightInput),
  description:
    "Compute the total takeoff weight from fuel and either ZFW or payload.",
  id: "aviation/takeoff-weight",
  inputs: [
    {
      description: "Usable fuel on board.",
      id: "fuelWeightLb",
      kind: "number",
      label: "Fuel weight",
      unit: "lb",
    },
    {
      description: "Total payload (crew, passengers, cargo).",
      id: "payloadLb",
      kind: "number",
      label: "Payload",
      unit: "lb",
    },
    {
      description: "Zero fuel weight if known; overrides the payload input.",
      id: "zeroFuelWeightLb",
      kind: "number",
      label: "Zero fuel weight",
      unit: "lb",
      required: false,
    },
  ],
  outputs: [
    {
      description: "Total weight at the start of the takeoff roll.",
      format: "weight-lb",
      id: "takeoffWeightLb",
      kind: "number",
      label: "Takeoff weight",
      unit: "lb",
    },
  ],
  title: "Takeoff Weight Calculator",
});
export const runTakeoffWeight = takeoffWeightTool.execute;
export default takeoffWeightTool;
