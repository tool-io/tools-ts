import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredSurfaceRecombinationFlux: number;
  readonly matchedSurfaceExcessCarrierVolumeDensity: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "independentlyMeasuredSurfaceRecombinationFlux",
    label: "Independently measured surface recombination flux",
    kind: "number",
  },
  {
    id: "matchedSurfaceExcessCarrierVolumeDensity",
    label: "Matched surface excess carrier volume density",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.independentlyMeasuredSurfaceRecombinationFlux, "numerator");
  positive(input.matchedSurfaceExcessCarrierVolumeDensity, "denominator");
  return {
    observedRatio:
      (1 * input.independentlyMeasuredSurfaceRecombinationFlux) /
      input.matchedSurfaceExcessCarrierVolumeDensity,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredSurfaceRecombinationFlux: 2,
    matchedSurfaceExcessCarrierVolumeDensity: 4,
  },
  output: { result: { observedRatio: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/surface-recombination-velocity",
  title: "Semiconductor Surface Recombination Velocity Calculator",
  description:
    "Actual surface flux/excess volume-density recombination velocity, not equate areal and volumetric units. Actual independently matched quantities/units required; not infer causal effect, clinical guidance or safe design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { observedRatio: { type: "number" } },
        required: ["observedRatio"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
