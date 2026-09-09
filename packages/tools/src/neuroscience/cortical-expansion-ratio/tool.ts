import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredLaterCorticalSurfaceArea: number;
  readonly independentlyMeasuredEarlierCorticalSurfaceArea: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredLaterCorticalSurfaceArea",
    label: "Independently measured later cortical surface area",
    kind: "number",
  },
  {
    id: "independentlyMeasuredEarlierCorticalSurfaceArea",
    label: "Independently measured earlier cortical surface area",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.independentlyMeasuredLaterCorticalSurfaceArea, "numerator");
  positive(
    input.independentlyMeasuredEarlierCorticalSurfaceArea,
    "denominator",
  );
  return {
    observedRatio:
      (1 * input.independentlyMeasuredLaterCorticalSurfaceArea) /
      input.independentlyMeasuredEarlierCorticalSurfaceArea,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredLaterCorticalSurfaceArea: 2,
    independentlyMeasuredEarlierCorticalSurfaceArea: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/cortical-expansion-ratio",
  title: "Cortical Expansion Ratio Calculator",
  description:
    "Actual longitudinal cortical surface expansion ratio for compatible matched reconstructions; not cortical thickness or age-normalized growth. Independently measured compatible definitions/units required; ratio is not a diagnosis, efficacy measure or safety/clinical threshold.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
