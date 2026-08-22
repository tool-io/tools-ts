import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PowerLoadingInput = {
  readonly horsepower: number;
  readonly weightLb: number;
};

export type PowerLoadingOutput = {
  readonly powerLoadingLbPerHp: number;
};

export const powerLoadingExample = {
  input: { horsepower: 180, weightLb: 2400 },
  output: { powerLoadingLbPerHp: 13.333333333333334 },
} satisfies ToolExample<PowerLoadingInput, PowerLoadingOutput>;

export const calculatePowerLoading = (
  input: PowerLoadingInput,
): PowerLoadingOutput => {
  if (input.horsepower <= 0)
    simpleError(
      "horsepower",
      "The engine power must be positive.",
      "invalid_power",
    );
  return { powerLoadingLbPerHp: input.weightLb / input.horsepower };
};

export const powerLoadingTool = createSimpleTool({
  calculate: (input) =>
    calculatePowerLoading(input as unknown as PowerLoadingInput),
  description:
    "Compute the power loading as aircraft weight divided by engine power.",
  id: "aviation/power-loading",
  inputs: [
    {
      description: "Aircraft weight.",
      id: "weightLb",
      kind: "number",
      label: "Weight",
      unit: "lb",
    },
    {
      description: "Engine power.",
      id: "horsepower",
      kind: "number",
      label: "Power",
      unit: "hp",
    },
  ],
  outputs: [
    {
      description: "Weight per unit of engine power.",
      format: "power-loading",
      id: "powerLoadingLbPerHp",
      kind: "number",
      label: "Power loading",
      unit: "lb/hp",
    },
  ],
  title: "Power Loading Calculator",
});
export const runPowerLoading = powerLoadingTool.execute;
export default powerLoadingTool;
