import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedBodyFontPoints: number;
  readonly callerAllCapsCompensationPercent: number;
}>;
export type Output = Readonly<{ readonly callerAdjustedAllCapsPoints: number }>;
const inputFields = [
  {
    id: "observedBodyFontPoints",
    label: "Observed body font points",
    kind: "number",
  },
  {
    id: "callerAllCapsCompensationPercent",
    label: "Caller all caps compensation percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedBodyFontPoints, "observedBodyFontPoints");
  if (input.callerAllCapsCompensationPercent <= -100)
    simpleError("compensation", "Resultingsizepositive.");
  return {
    callerAdjustedAllCapsPoints:
      input.observedBodyFontPoints *
      (1 + input.callerAllCapsCompensationPercent / 100),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedBodyFontPoints: 12,
  callerAllCapsCompensationPercent: -5,
} satisfies Input;
export const exampleOutput = {
  callerAdjustedAllCapsPoints: 11.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "typography/all-caps-size-compensation-percent",
  title: "All-Caps Size Compensation Percent",
  description:
    "Caller explicit SIGNED all-caps additive percent compensation, size positive; not universal optical equivalence. Explicit caller font/layout/reference context; not a shaping engine, actual page layout or accessibility certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAdjustedAllCapsPoints",
      label: "Caller adjusted all caps points",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedBodyFontPoints: value.observedBodyFontPoints as number,
      callerAllCapsCompensationPercent:
        value.callerAllCapsCompensationPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
