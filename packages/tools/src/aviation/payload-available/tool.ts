import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PayloadAvailableInput = {
  readonly basicEmptyWeightLb: number;
  readonly fuelWeightLb: number;
  readonly maxTakeoffWeightLb: number;
};

export type PayloadAvailableOutput = {
  readonly payloadAvailableLb: number;
};

export const payloadAvailableExample = {
  input: {
    basicEmptyWeightLb: 1600,
    fuelWeightLb: 240,
    maxTakeoffWeightLb: 2400,
  },
  output: { payloadAvailableLb: 560 },
} satisfies ToolExample<PayloadAvailableInput, PayloadAvailableOutput>;

export const calculatePayloadAvailable = (
  input: PayloadAvailableInput,
): PayloadAvailableOutput => {
  if (input.maxTakeoffWeightLb <= 0)
    simpleError(
      "maxTakeoffWeightLb",
      "The max takeoff weight must be positive.",
      "invalid_weight",
    );
  const payload =
    input.maxTakeoffWeightLb - input.basicEmptyWeightLb - input.fuelWeightLb;
  return { payloadAvailableLb: payload };
};

export const payloadAvailableTool = createSimpleTool({
  calculate: (input) =>
    calculatePayloadAvailable(input as unknown as PayloadAvailableInput),
  description:
    "Compute the remaining payload capacity after subtracting empty weight and fuel from max takeoff weight.",
  id: "aviation/payload-available",
  inputs: [
    {
      description: "Basic empty weight of the aircraft.",
      id: "basicEmptyWeightLb",
      kind: "number",
      label: "Empty weight",
      unit: "lb",
    },
    {
      description: "Total usable fuel weight.",
      id: "fuelWeightLb",
      kind: "number",
      label: "Fuel weight",
      unit: "lb",
    },
    {
      description: "Maximum certified takeoff weight.",
      id: "maxTakeoffWeightLb",
      kind: "number",
      label: "Max takeoff weight",
      unit: "lb",
    },
  ],
  outputs: [
    {
      description:
        "Available payload; negative means the aircraft is over maximum weight.",
      format: "weight-lb",
      id: "payloadAvailableLb",
      kind: "number",
      label: "Payload available",
      unit: "lb",
    },
  ],
  title: "Payload Available Calculator",
});
export const runPayloadAvailable = payloadAvailableTool.execute;
export default payloadAvailableTool;
