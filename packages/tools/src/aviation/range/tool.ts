import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";
import { calculateEndurance } from "../endurance/tool.js";

export type RangeInput = {
  readonly fuelFlowLitersPerHour: number;
  readonly groundSpeedKt: number;
  readonly usableFuelLiters: number;
};

export type RangeOutput = {
  readonly rangeNm: number;
};

export const rangeExample = {
  input: {
    fuelFlowLitersPerHour: 40,
    groundSpeedKt: 120,
    usableFuelLiters: 120,
  },
  output: { rangeNm: 360 },
} satisfies ToolExample<RangeInput, RangeOutput>;

export const calculateRange = (input: RangeInput): RangeOutput => {
  if (input.groundSpeedKt <= 0)
    simpleError(
      "groundSpeedKt",
      "The ground speed must be positive.",
      "invalid_speed",
    );
  const endurance = calculateEndurance({
    fuelFlowLitersPerHour: input.fuelFlowLitersPerHour,
    usableFuelLiters: input.usableFuelLiters,
  });
  return {
    rangeNm: roundStatistic(endurance.enduranceHours * input.groundSpeedKt),
  };
};

export const rangeTool = createSimpleTool({
  calculate: (input) => calculateRange(input as unknown as RangeInput),
  description:
    "Compute the still-air distance reachable from usable fuel, flow rate, and ground speed.",
  id: "aviation/range",
  inputs: [
    {
      description: "Usable fuel on board.",
      id: "usableFuelLiters",
      kind: "number",
      label: "Usable fuel",
      unit: "L",
    },
    {
      description: "Fuel consumption rate.",
      id: "fuelFlowLitersPerHour",
      kind: "number",
      label: "Fuel flow",
      unit: "L/h",
    },
    {
      description: "Ground speed over the route.",
      id: "groundSpeedKt",
      kind: "number",
      label: "Ground speed",
      unit: "kt",
    },
  ],
  outputs: [
    {
      description: "Reachable distance before fuel exhaustion.",
      format: "length-nm",
      id: "rangeNm",
      kind: "number",
      label: "Range",
      unit: "nm",
    },
  ],
  title: "Range Calculator",
});
export const runRange = rangeTool.execute;
export default rangeTool;
