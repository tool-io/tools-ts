import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyReconstructedSymmetricFullSpreadingDistanceKm: number;
  readonly actualElapsedMillionsOfYears: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyReconstructedSymmetricFullSpreadingDistanceKm",
    label: "Independently reconstructed symmetric full spreading distance km",
    kind: "number",
  },
  {
    id: "actualElapsedMillionsOfYears",
    label: "Actual elapsed millions of years",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.independentlyReconstructedSymmetricFullSpreadingDistanceKm,
    "full-distance",
  );
  positive(input.actualElapsedMillionsOfYears, "duration");
  return {
    conditionalHalfSpreadingRateMillimetersPerYear:
      input.independentlyReconstructedSymmetricFullSpreadingDistanceKm /
      (2 * input.actualElapsedMillionsOfYears),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyReconstructedSymmetricFullSpreadingDistanceKm: 20,
    actualElapsedMillionsOfYears: 2,
  },
  output: { result: { conditionalHalfSpreadingRateMillimetersPerYear: 5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/mid-ocean-ridge-spreading-rate-half",
  title: "Geology Mid Ocean Ridge Spreading Rate Half Calculator",
  description:
    "Declared symmetric half-spreading rate from full conjugate distance and actual duration, km/Ma=mm/yr. Symmetry/reconstruction external; not single-flank distance silently halved.",
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
