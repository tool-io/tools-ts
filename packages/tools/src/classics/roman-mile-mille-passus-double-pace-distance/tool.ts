import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly romanMiles: number;
  readonly callerVerifiedMetresPerFoot: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "romanMiles", label: "Roman miles", kind: "number" },
  {
    id: "callerVerifiedMetresPerFoot",
    label: "Caller verified metres per foot",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerVerifiedMetresPerFoot, "callerVerifiedMetresPerFoot");
  nonnegative(input.romanMiles, "romanMiles");
  return {
    doublePaces: 1000 * input.romanMiles,
    feet: 5000 * input.romanMiles,
    conditionalMetres:
      5000 * input.romanMiles * input.callerVerifiedMetresPerFoot,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { romanMiles: 2, callerVerifiedMetresPerFoot: 0.296 },
  output: {
    result: { doublePaces: 2000, feet: 10000, conditionalMetres: 2960 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/roman-mile-mille-passus-double-pace-distance",
  title: "Roman Mile Mille Passus Double Pace Distance",
  description:
    "Roman mile modeled as 1000double paces/5000 feet; SI conversion requires an independently verified site/era foot calibration, not unique historical length.",
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
