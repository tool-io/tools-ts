import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ZeroFuelWeightInput = {
  readonly basicEmptyWeightLb: number;
  readonly payloadLb: number;
};

export type ZeroFuelWeightOutput = {
  readonly zeroFuelWeightLb: number;
};

export const zeroFuelWeightExample = {
  input: { basicEmptyWeightLb: 1600, payloadLb: 500 },
  output: { zeroFuelWeightLb: 2100 },
} satisfies ToolExample<ZeroFuelWeightInput, ZeroFuelWeightOutput>;

export const calculateZeroFuelWeight = (
  input: ZeroFuelWeightInput,
): ZeroFuelWeightOutput => ({
  zeroFuelWeightLb: input.basicEmptyWeightLb + input.payloadLb,
});

export const zeroFuelWeightTool = createSimpleTool({
  calculate: (input) =>
    calculateZeroFuelWeight(input as unknown as ZeroFuelWeightInput),
  description:
    "Compute the zero fuel weight as the sum of empty weight and payload.",
  id: "aviation/zero-fuel-weight",
  inputs: [
    {
      description: "Basic empty weight of the aircraft.",
      id: "basicEmptyWeightLb",
      kind: "number",
      label: "Empty weight",
      unit: "lb",
    },
    {
      description: "Total payload (crew, passengers, cargo).",
      id: "payloadLb",
      kind: "number",
      label: "Payload",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description: "Weight before fuel is added.",
      format: "weight-lb",
      id: "zeroFuelWeightLb",
      kind: "number",
      label: "Zero fuel weight",
      unit: "lb",
    },
  ],
  title: "Zero Fuel Weight Calculator",
});
export const runZeroFuelWeight = zeroFuelWeightTool.execute;
export default zeroFuelWeightTool;
