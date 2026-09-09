import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualSr87Sr86Ratio: number;
  readonly actualRb87Sr86Ratio: number;
  readonly callerIndependentlyEstablishedAgeYears: number;
  readonly callerVerifiedRb87DecayConstantPerYear: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSr87Sr86Ratio",
    label: "Actual sr87 sr86 ratio",
    kind: "number",
  },
  {
    id: "actualRb87Sr86Ratio",
    label: "Actual rb87 sr86 ratio",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedAgeYears",
    label: "Caller independently established age years",
    kind: "number",
  },
  {
    id: "callerVerifiedRb87DecayConstantPerYear",
    label: "Caller verified rb87 decay constant per year",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualSr87Sr86Ratio, "Sr");
  nonnegative(input.actualRb87Sr86Ratio, "Rb");
  nonnegative(input.callerIndependentlyEstablishedAgeYears, "age");
  positive(input.callerVerifiedRb87DecayConstantPerYear, "lambda");
  return {
    conditionalInitialSr87Sr86Ratio:
      input.actualSr87Sr86Ratio -
      input.actualRb87Sr86Ratio *
        Math.expm1(
          input.callerVerifiedRb87DecayConstantPerYear *
            input.callerIndependentlyEstablishedAgeYears,
        ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSr87Sr86Ratio: 0.8,
    actualRb87Sr86Ratio: 0.1,
    callerIndependentlyEstablishedAgeYears: 1,
    callerVerifiedRb87DecayConstantPerYear: 0.6931471805599453,
  },
  output: { result: { conditionalInitialSr87Sr86Ratio: 0.7 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/rb-sr-initial-ratio",
  title: "Geology Rb Sr Initial Ratio Calculator",
  description:
    "Declared closed-system initial87Sr/86Srat independently established age, subtract87Rb/86Sr(exp\u03bbt\u22121). Not fit isochron age, initial reservoir or open-system correction; negative inferred residual retained for inconsistent data.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
