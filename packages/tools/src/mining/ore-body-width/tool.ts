import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, shape } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedOreLocalPlanXyM: readonly (readonly number[])[];
  readonly callerUnitWidthDirectionXy: readonly number[];
}>;
export type Output = Readonly<{ readonly observedProjectedOreWidthM: number }>;
const inputFields = [
  {
    id: "observedOreLocalPlanXyM",
    label: "Observed ore local plan xy m",
    kind: "matrix",
  },
  {
    id: "callerUnitWidthDirectionXy",
    label: "Caller unit width direction xy",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (
    shape(input.observedOreLocalPlanXyM, "points") !== 2 ||
    input.callerUnitWidthDirectionXy.length !== 2 ||
    Math.abs(Math.hypot(...input.callerUnitWidthDirectionXy) - 1) > 1e-10
  )
    simpleError(
      "direction",
      "Explicit caller unit local width direction required.",
    );
  const s = input.observedOreLocalPlanXyM.map(
    (p) =>
      p[0] * input.callerUnitWidthDirectionXy[0] +
      p[1] * input.callerUnitWidthDirectionXy[1],
  );
  return { observedProjectedOreWidthM: Math.max(...s) - Math.min(...s) };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOreLocalPlanXyM: [
    [0, 0],
    [3, 4],
    [1, 2],
  ],
  callerUnitWidthDirectionXy: [0, 1],
} satisfies Input;
export const exampleOutput = { observedProjectedOreWidthM: 4 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/ore-body-width",
  title: "Ore Body Width Calculator",
  description:
    "Measure observed ore footprint span in independently specified local width direction, not fitted geological width, geodesy or coordinate inference. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedProjectedOreWidthM",
      label: "Observed projected ore width m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOreLocalPlanXyM:
        value.observedOreLocalPlanXyM as readonly (readonly number[])[],
      callerUnitWidthDirectionXy:
        value.callerUnitWidthDirectionXy as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
