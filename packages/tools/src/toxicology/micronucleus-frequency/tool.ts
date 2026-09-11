import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyClassifiedMicronucleatedCells: number;
  readonly actualAssessedEligibleCells: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyClassifiedMicronucleatedCells",
    label: "Actual independently classified micronucleated cells",
    kind: "number",
  },
  {
    id: "actualAssessedEligibleCells",
    label: "Actual assessed eligible cells",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  bounded(input.actualAssessedEligibleCells, "eligible-count", 1, 10000000);
  bounded(
    input.actualIndependentlyClassifiedMicronucleatedCells,
    "qualified-count",
    0,
    input.actualAssessedEligibleCells,
  );
  nonnegative(
    input.actualIndependentlyClassifiedMicronucleatedCells,
    "numerator",
  );
  positive(input.actualAssessedEligibleCells, "denominator");
  return {
    observedRatio:
      (100 * input.actualIndependentlyClassifiedMicronucleatedCells) /
      input.actualAssessedEligibleCells,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyClassifiedMicronucleatedCells: 2,
    actualAssessedEligibleCells: 4,
  },
  output: { result: { observedRatio: 50.0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/micronucleus-frequency",
  title: "Micronucleus Frequency Calculator",
  description:
    "Actual micronucleated-cell frequency, one classified cell counted once; not total micronuclei percell. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
