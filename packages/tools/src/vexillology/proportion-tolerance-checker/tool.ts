import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly observedHoist: number;
  readonly observedFly: number;
  readonly referenceHoistUnits: number;
  readonly referenceFlyUnits: number;
  readonly callerRelativeTolerance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "observedHoist", label: "Observed hoist", kind: "number" },
  { id: "observedFly", label: "Observed fly", kind: "number" },
  { id: "referenceHoistUnits", label: "Reference hoist units", kind: "number" },
  { id: "referenceFlyUnits", label: "Reference fly units", kind: "number" },
  {
    id: "callerRelativeTolerance",
    label: "Caller relative tolerance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.observedHoist, "observedHoist");
  positive(input.observedFly, "observedFly");
  positive(input.referenceHoistUnits, "referenceHoistUnits");
  positive(input.referenceFlyUnits, "referenceFlyUnits");
  nonnegative(input.callerRelativeTolerance, "callerRelativeTolerance");
  const error =
    input.observedHoist /
      input.observedFly /
      (input.referenceHoistUnits / input.referenceFlyUnits) -
    1;
  return {
    relativeHoistFlyError: error,
    withinCallerTolerance: Math.abs(error) <= input.callerRelativeTolerance,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedHoist: 100,
    observedFly: 153,
    referenceHoistUnits: 2,
    referenceFlyUnits: 3,
    callerRelativeTolerance: 0.02,
  },
  output: {
    result: {
      relativeHoistFlyError: -0.0196078431372549,
      withinCallerTolerance: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/proportion-tolerance-checker",
  title: "Proportion Compliance Tolerance Checker (\u00b12%)",
  description:
    "Compare relative hoist/fly ratio error, not separate dimensional tolerances or flag-code compliance.\u00b12%example is caller policy only.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
