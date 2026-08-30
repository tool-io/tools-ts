import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly recallPercent: number;
  readonly lowerTargetPercent: number;
  readonly upperTargetPercent: number;
}>;
export type Output = Readonly<{
  readonly deviationPoints: number;
  readonly adjustment: string;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.recallPercent < 0 ||
    input.recallPercent > 100 ||
    input.lowerTargetPercent < 0 ||
    input.upperTargetPercent > 100 ||
    input.lowerTargetPercent > input.upperTargetPercent
  )
    simpleError(
      "recallPercent",
      "Recall and ordered target percentages must be within 0–100.",
    );
  return {
    deviationPoints:
      input.recallPercent < input.lowerTargetPercent
        ? input.lowerTargetPercent - input.recallPercent
        : input.recallPercent > input.upperTargetPercent
          ? input.recallPercent - input.upperTargetPercent
          : 0,
    adjustment:
      input.recallPercent < input.lowerTargetPercent
        ? "reduce-difficulty"
        : input.recallPercent > input.upperTargetPercent
          ? "increase-difficulty"
          : "maintain",
  };
};
export const exampleInput = {
  recallPercent: 65,
  lowerTargetPercent: 60,
  upperTargetPercent: 80,
} satisfies Input;
export const exampleOutput = {
  deviationPoints: 0,
  adjustment: "maintain",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pedagogy/desirable-difficulty-calibration",
  title: "Desirable Difficulty Calibration",
  description:
    "Calibrate practice difficulty from observed recall and caller target band.",
  inputs: [
    { id: "recallPercent", label: "Recall percent", kind: "number" },
    { id: "lowerTargetPercent", label: "Lower target percent", kind: "number" },
    { id: "upperTargetPercent", label: "Upper target percent", kind: "number" },
  ],
  outputs: [
    { id: "deviationPoints", label: "Deviation points", kind: "number" },
    { id: "adjustment", label: "Adjustment", kind: "string" },
  ],
  calculate: (value) =>
    calculate({
      recallPercent: value.recallPercent as number,
      lowerTargetPercent: value.lowerTargetPercent as number,
      upperTargetPercent: value.upperTargetPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
