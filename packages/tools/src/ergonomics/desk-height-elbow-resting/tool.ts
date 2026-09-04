import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedFloorElbowHeightCm: number;
  readonly observedKeyboardSurfaceThicknessCm: number;
  readonly callerPreferredHandBelowElbowCm: number;
}>;
export type Output = Readonly<{ readonly conditionalDeskTopHeightCm: number }>;
const inputFields = [
  {
    id: "observedFloorElbowHeightCm",
    label: "Observed floor elbow height cm",
    kind: "number",
  },
  {
    id: "observedKeyboardSurfaceThicknessCm",
    label: "Observed keyboard surface thickness cm",
    kind: "number",
  },
  {
    id: "callerPreferredHandBelowElbowCm",
    label: "Caller preferred hand below elbow cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedFloorElbowHeightCm, "observedFloorElbowHeightCm");
  nonnegative(
    input.observedKeyboardSurfaceThicknessCm,
    "observedKeyboardSurfaceThicknessCm",
  );
  nonnegative(
    input.callerPreferredHandBelowElbowCm,
    "callerPreferredHandBelowElbowCm",
  );
  return {
    conditionalDeskTopHeightCm: positive(
      input.observedFloorElbowHeightCm -
        input.observedKeyboardSurfaceThicknessCm -
        input.callerPreferredHandBelowElbowCm,
      "positive desk height",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFloorElbowHeightCm: 70,
  observedKeyboardSurfaceThicknessCm: 3,
  callerPreferredHandBelowElbowCm: 2,
} satisfies Input;
export const exampleOutput = {
  conditionalDeskTopHeightCm: 65,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/desk-height-elbow-resting",
  title: "Desk Height from Elbow Resting Height Calculator",
  description:
    "Actual resting elbow height minus device stack and explicit preferred hand offset; no anthropometric population default. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "conditionalDeskTopHeightCm",
      label: "Conditional desk top height cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFloorElbowHeightCm: value.observedFloorElbowHeightCm as number,
      observedKeyboardSurfaceThicknessCm:
        value.observedKeyboardSurfaceThicknessCm as number,
      callerPreferredHandBelowElbowCm:
        value.callerPreferredHandBelowElbowCm as number,
    }),
});
export const run = tool.execute;
export default tool;
