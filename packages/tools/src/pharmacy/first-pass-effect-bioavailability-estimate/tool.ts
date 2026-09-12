import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyEstablishedAbsorbedFraction: number;
  readonly callerIndependentlyEstablishedGutEscapeFraction: number;
  readonly callerIndependentlyEstablishedHepaticEscapeFraction: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerIndependentlyEstablishedAbsorbedFraction",
    label: "Caller independently established absorbed fraction",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedGutEscapeFraction",
    label: "Caller independently established gut escape fraction",
    kind: "number",
  },
  {
    id: "callerIndependentlyEstablishedHepaticEscapeFraction",
    label: "Caller independently established hepatic escape fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  fraction(
    input.callerIndependentlyEstablishedAbsorbedFraction,
    "callerIndependentlyEstablishedAbsorbedFraction",
  );
  fraction(
    input.callerIndependentlyEstablishedGutEscapeFraction,
    "callerIndependentlyEstablishedGutEscapeFraction",
  );
  fraction(
    input.callerIndependentlyEstablishedHepaticEscapeFraction,
    "callerIndependentlyEstablishedHepaticEscapeFraction",
  );
  return {
    value:
      input.callerIndependentlyEstablishedAbsorbedFraction *
      input.callerIndependentlyEstablishedGutEscapeFraction *
      input.callerIndependentlyEstablishedHepaticEscapeFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyEstablishedAbsorbedFraction: 1,
    callerIndependentlyEstablishedGutEscapeFraction: 0.5,
    callerIndependentlyEstablishedHepaticEscapeFraction: 0.5,
  },
  output: { result: { value: 0.25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pharmacy/first-pass-effect-bioavailability-estimate",
  title: "First-Pass Bioavailability Estimate",
  description:
    "Explicit F=FaFgFhserial absorbed/gut escape/hepatic escape fractions independently established; not portal extraction-only ledger or simultaneous unverified kinetics. All patient/product/route/units and applicable inputs independently clinically established; no dose, route, frequency, eligibility, titration, diagnosis or permission to administer is supplied.",
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
