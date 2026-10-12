import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly observedBoxVolumeCubicFeet: number;
  readonly independentlyMeasuredEffectiveShelfCrossSectionSquareMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "observedBoxVolumeCubicFeet",
    label: "Observed box volume cubic feet",
    kind: "number",
  },
  {
    id: "independentlyMeasuredEffectiveShelfCrossSectionSquareMeters",
    label: "Independently measured effective shelf cross section square meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(input.observedBoxVolumeCubicFeet, "volume");
  positive(
    input.independentlyMeasuredEffectiveShelfCrossSectionSquareMeters,
    "area",
  );
  return {
    conditionalFilledShelfLengthMeters:
      (input.observedBoxVolumeCubicFeet * 0.028316846592) /
      input.independentlyMeasuredEffectiveShelfCrossSectionSquareMeters,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    observedBoxVolumeCubicFeet: 1,
    independentlyMeasuredEffectiveShelfCrossSectionSquareMeters: 0.028316846592,
  },
  output: { result: { conditionalFilledShelfLengthMeters: 1 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/cubic-foot-to-linear-metre",
  title: "Cubic Foot to Linear Metre Converter Archives",
  description:
    "Convert cubic-foot volume to filled linear shelving only using actual independently measured compatible cross-sectional area; no fixed universal cubic-foot/linear-metre equivalence, packing/fill or usable capacity inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conditionalFilledShelfLengthMeters: { type: "number" } },
        required: ["conditionalFilledShelfLengthMeters"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
