import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualPrintedScaleBarLengthMm: number;
  readonly actualRepresentedScaleBarGroundMeters: number;
  readonly callerIntendedScaleDenominator: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPrintedScaleBarLengthMm",
    label: "Actual printed scale bar length mm",
    kind: "number",
  },
  {
    id: "actualRepresentedScaleBarGroundMeters",
    label: "Actual represented scale bar ground meters",
    kind: "number",
  },
  {
    id: "callerIntendedScaleDenominator",
    label: "Caller intended scale denominator",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualPrintedScaleBarLengthMm, "print");
  positive(input.actualRepresentedScaleBarGroundMeters, "ground");
  positive(input.callerIntendedScaleDenominator, "scale");
  const r =
    (1000 * input.actualRepresentedScaleBarGroundMeters) /
    input.actualPrintedScaleBarLengthMm;
  return {
    observedPrintedScaleDenominator: r,
    signedScaleDenominatorDiscrepancy: r - input.callerIntendedScaleDenominator,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPrintedScaleBarLengthMm: 10,
    actualRepresentedScaleBarGroundMeters: 5,
    callerIntendedScaleDenominator: 500,
  },
  output: {
    result: {
      observedPrintedScaleDenominator: 500,
      signedScaleDenominatorDiscrepancy: 0,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/map-scale-ratio-checker",
  title: "Scale Bar Ratio Map Print Checker (1:500 etc.)",
  description:
    "Actual print scale groundmeters\u00d71000/printedmm, comparison to callerintended1:N. Printer/display scaling and ruler uncertainty external; not infer coordinate accuracy.",
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
