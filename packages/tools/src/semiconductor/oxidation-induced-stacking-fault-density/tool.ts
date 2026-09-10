import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyQualifiedOxidationStackingFaultCount: number;
  readonly actualExaminedSurfaceSquareMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyQualifiedOxidationStackingFaultCount",
    label: "Independently qualified oxidation stacking fault count",
    kind: "number",
  },
  {
    id: "actualExaminedSurfaceSquareMeters",
    label: "Actual examined surface square meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.independentlyQualifiedOxidationStackingFaultCount,
    "numerator",
  );
  positive(input.actualExaminedSurfaceSquareMeters, "denominator");
  return {
    observedRatio:
      (1 * input.independentlyQualifiedOxidationStackingFaultCount) /
      input.actualExaminedSurfaceSquareMeters,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyQualifiedOxidationStackingFaultCount: 2,
    actualExaminedSurfaceSquareMeters: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/oxidation-induced-stacking-fault-density",
  title: "Semiconductor Oxidation Induced Stacking Fault Density Calculator",
  description:
    "Actual independently identified oxidation-induced stacking-fault density per examined square meter, not all etch pits automatically faults. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
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
