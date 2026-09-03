import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly iugera: number;
  readonly callerVerifiedMetresPerFoot: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "iugera", label: "Iugera", kind: "number" },
  {
    id: "callerVerifiedMetresPerFoot",
    label: "Caller verified metres per foot",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.callerVerifiedMetresPerFoot, "callerVerifiedMetresPerFoot");
  nonnegative(input.iugera, "iugera");
  return {
    squareRomanFeet: 28800 * input.iugera,
    conditionalSquareMetres:
      28800 * input.iugera * input.callerVerifiedMetresPerFoot ** 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { iugera: 2, callerVerifiedMetresPerFoot: 0.296 },
  output: {
    result: { squareRomanFeet: 57600, conditionalSquareMetres: 5046.6816 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "classics/iugerum-area-unit-field-measure-lookup",
  title: "Iugerum Area Unit Field Measure Lookup",
  description:
    "Conventional iugerum120\u00d7240Roman feet; physical area conditional on independently verified foot calibration, not land-survey/legal entitlement.",
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
