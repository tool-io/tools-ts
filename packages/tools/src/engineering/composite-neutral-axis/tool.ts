import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
  finite,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly layerAreasM2: readonly number[];
  readonly layerCentroidYM: readonly number[];
  readonly layerElasticModuliPa: readonly number[];
}>;
export type Output = Readonly<{ readonly transformedNeutralAxisYM: number }>;
const inputFields = [
  { id: "layerAreasM2", label: "Layer areas m2", kind: "numberList" },
  { id: "layerCentroidYM", label: "Layer centroid y m", kind: "numberList" },
  {
    id: "layerElasticModuliPa",
    label: "Layer elastic moduli pa",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.layerAreasM2.forEach((v) => positive(v, "layerAreasM2"));
  input.layerElasticModuliPa.forEach((v) =>
    positive(v, "layerElasticModuliPa"),
  );
  aligned(input.layerAreasM2, input.layerCentroidYM, "layerAreasM2");
  aligned(input.layerAreasM2, input.layerElasticModuliPa, "layerAreasM2");
  const ea = input.layerAreasM2.map((v, i) =>
    finite(v * input.layerElasticModuliPa[i]),
  );
  return {
    transformedNeutralAxisYM:
      sum(ea.map((v, i) => v * input.layerCentroidYM[i])) / sum(ea),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  layerAreasM2: [1, 2],
  layerCentroidYM: [0, 3],
  layerElasticModuliPa: [2, 1],
} satisfies Input;
export const exampleOutput = { transformedNeutralAxisYM: 1.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/composite-neutral-axis",
  title: "Composite Beam Neutral Axis Calculator",
  description:
    "Elastic modulus-weighted composite neutral axis, perfect bond/linear elastic assumption explicit. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "transformedNeutralAxisYM",
      label: "Transformed neutral axis y m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      layerAreasM2: value.layerAreasM2 as readonly number[],
      layerCentroidYM: value.layerCentroidYM as readonly number[],
      layerElasticModuliPa: value.layerElasticModuliPa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
