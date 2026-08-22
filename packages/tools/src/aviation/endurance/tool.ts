import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type EnduranceInput = {
  readonly fuelFlowLitersPerHour: number;
  readonly usableFuelLiters: number;
};

export type EnduranceOutput = {
  readonly enduranceHours: number;
};

export const enduranceExample = {
  input: { fuelFlowLitersPerHour: 40, usableFuelLiters: 120 },
  output: { enduranceHours: 3 },
} satisfies ToolExample<EnduranceInput, EnduranceOutput>;

export const calculateEndurance = (input: EnduranceInput): EnduranceOutput => {
  if (input.fuelFlowLitersPerHour <= 0)
    simpleError(
      "fuelFlowLitersPerHour",
      "The fuel flow must be positive.",
      "invalid_flow",
    );
  if (input.usableFuelLiters < 0)
    simpleError(
      "usableFuelLiters",
      "Usable fuel cannot be negative.",
      "invalid_fuel",
    );
  return {
    enduranceHours: roundStatistic(
      input.usableFuelLiters / input.fuelFlowLitersPerHour,
    ),
  };
};

export const enduranceTool = createSimpleTool({
  calculate: (input) => calculateEndurance(input as unknown as EnduranceInput),
  description:
    "Compute how long the usable fuel lasts at a given consumption rate.",
  id: "aviation/endurance",
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
  ],
  outputs: [
    {
      description: "Endurance of the available fuel.",
      format: "duration-h",
      id: "enduranceHours",
      kind: "number",
      label: "Endurance",
      unit: "h",
    },
  ],
  title: "Endurance Calculator",
});
export const runEndurance = enduranceTool.execute;
export default enduranceTool;
