import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualQualifiedUsableFillMassMg: number;
  readonly callerVerifiedPerCapsuleFillMassMg: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualQualifiedUsableFillMassMg",
    label: "Actual qualified usable fill mass mg",
    kind: "number",
  },
  {
    id: "callerVerifiedPerCapsuleFillMassMg",
    label: "Caller verified per capsule fill mass mg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualQualifiedUsableFillMassMg,
    "actualQualifiedUsableFillMassMg",
  );
  positive(
    input.callerVerifiedPerCapsuleFillMassMg,
    "callerVerifiedPerCapsuleFillMassMg",
  );
  return {
    value: Math.floor(
      input.actualQualifiedUsableFillMassMg /
        input.callerVerifiedPerCapsuleFillMassMg,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualQualifiedUsableFillMassMg: 10,
    callerVerifiedPerCapsuleFillMassMg: 3,
  },
  output: { result: { value: 3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/capsule-count-by-factor",
  title: "Capsule Count By Factor Calculator",
  description:
    "Actual usable total fill mass/per capsule filled mass floor whole capsule count, not active ingredient dose, powder displacement, recovery or compounding instructions. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
