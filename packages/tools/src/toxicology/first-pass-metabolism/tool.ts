import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualPortalDeliveredMass: number;
  readonly independentlyMeasuredMassEscapingFirstPass: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPortalDeliveredMass",
    label: "Actual portal delivered mass",
    kind: "number",
  },
  {
    id: "independentlyMeasuredMassEscapingFirstPass",
    label: "Independently measured mass escaping first pass",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualPortalDeliveredMass, "portal");
  nonnegative(input.independentlyMeasuredMassEscapingFirstPass, "escaping");
  if (
    input.independentlyMeasuredMassEscapingFirstPass >
    input.actualPortalDeliveredMass
  )
    simpleError("inventory", "Same actual mass pool:escaping≤delivered.");
  return {
    observedFirstPassExtractionFraction:
      1 -
      input.independentlyMeasuredMassEscapingFirstPass /
        input.actualPortalDeliveredMass,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPortalDeliveredMass: 10,
    independentlyMeasuredMassEscapingFirstPass: 6,
  },
  output: { result: { observedFirstPassExtractionFraction: 0.4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/first-pass-metabolism",
  title: "First-Pass Metabolism Calculator",
  description:
    "Actual portal-delivered minus independently resolved first-pass-escaping fraction, not oral absorption fraction, AUCavailability or hepatic-flow clearance.",
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
