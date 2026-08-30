import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly initialAnnualLayerThicknessM: number;
  readonly residenceDurationsYears: readonly number[];
  readonly verticalStrainRatesPerYear: readonly number[];
}>;
export type Output = Readonly<{
  readonly cumulativeLogThinning: number;
  readonly thinnedAnnualLayerThicknessM: number;
}>;
const inputFields = [
  {
    id: "initialAnnualLayerThicknessM",
    label: "Initial annual layer thickness m",
    kind: "number",
  },
  {
    id: "residenceDurationsYears",
    label: "Residence durations years",
    kind: "numberList",
  },
  {
    id: "verticalStrainRatesPerYear",
    label: "Vertical strain rates per year",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialAnnualLayerThicknessM, "initialAnnualLayerThicknessM");
  input.residenceDurationsYears.forEach((v) =>
    nonnegative(v, "residenceDurationsYears"),
  );
  aligned(
    input.residenceDurationsYears,
    input.verticalStrainRatesPerYear,
    "residenceDurationsYears",
  );
  const cumulativeLogThinning = input.residenceDurationsYears.reduce(
    (s, v, i) => s + v * input.verticalStrainRatesPerYear[i],
    0,
  );
  return {
    cumulativeLogThinning,
    thinnedAnnualLayerThicknessM:
      input.initialAnnualLayerThicknessM * Math.exp(cumulativeLogThinning),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialAnnualLayerThicknessM: 1,
  residenceDurationsYears: [10, 20],
  verticalStrainRatesPerYear: [-0.01, -0.02],
} satisfies Input;
export const exampleOutput = {
  cumulativeLogThinning: -0.5,
  thinnedAnnualLayerThicknessM: 0.6065306597126334,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/ice-core-layer-thinning-depth",
  title: "Ice Core Layer Thinning Depth",
  description:
    "Propagate layer thickness through supplied vertical-strain residence intervals; negative strain thins and positive strain thickens, without inferring strain from depth.",
  inputs: inputFields,
  outputs: [
    {
      id: "cumulativeLogThinning",
      label: "Cumulative log thinning",
      kind: "number",
    },
    {
      id: "thinnedAnnualLayerThicknessM",
      label: "Thinned annual layer thickness m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialAnnualLayerThicknessM:
        value.initialAnnualLayerThicknessM as number,
      residenceDurationsYears:
        value.residenceDurationsYears as readonly number[],
      verticalStrainRatesPerYear:
        value.verticalStrainRatesPerYear as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
