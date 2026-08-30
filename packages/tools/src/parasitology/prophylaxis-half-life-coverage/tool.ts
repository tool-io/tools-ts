import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative } from "../shared.js";

export type Input = Readonly<{
  readonly initialConcentration: number;
  readonly halfLifeHours: number;
  readonly dosingIntervalHours: number;
  readonly minimumCoverageConcentration: number;
}>;
export type Output = Readonly<{
  readonly predictedTrough: number;
  readonly aboveSuppliedThreshold: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.initialConcentration, "initialConcentration");
  positive(input.halfLifeHours, "halfLifeHours");
  nonnegative(input.dosingIntervalHours, "dosingIntervalHours");
  positive(input.minimumCoverageConcentration, "minimumCoverageConcentration");
  const predictedTrough =
    input.initialConcentration *
    0.5 ** (input.dosingIntervalHours / input.halfLifeHours);
  return {
    predictedTrough,
    aboveSuppliedThreshold:
      predictedTrough >= input.minimumCoverageConcentration,
  };
};
export const exampleInput = {
  initialConcentration: 100,
  halfLifeHours: 12,
  dosingIntervalHours: 24,
  minimumCoverageConcentration: 20,
} satisfies Input;
export const exampleOutput = {
  predictedTrough: 25,
  aboveSuppliedThreshold: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/prophylaxis-half-life-coverage",
  title: "Prophylaxis Half Life Coverage",
  description:
    "Screen a caller-defined interval using a simple single-dose decay model; not a dosing recommendation.",
  inputs: [
    {
      id: "initialConcentration",
      label: "Initial concentration",
      kind: "number",
    },
    { id: "halfLifeHours", label: "Half life hours", kind: "number" },
    {
      id: "dosingIntervalHours",
      label: "Dosing interval hours",
      kind: "number",
    },
    {
      id: "minimumCoverageConcentration",
      label: "Minimum coverage concentration",
      kind: "number",
    },
  ],
  outputs: [
    { id: "predictedTrough", label: "Predicted trough", kind: "number" },
    {
      id: "aboveSuppliedThreshold",
      label: "Above supplied threshold",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      initialConcentration: value.initialConcentration as number,
      halfLifeHours: value.halfLifeHours as number,
      dosingIntervalHours: value.dosingIntervalHours as number,
      minimumCoverageConcentration:
        value.minimumCoverageConcentration as number,
    }),
});
export const run = tool.execute;
export default tool;
