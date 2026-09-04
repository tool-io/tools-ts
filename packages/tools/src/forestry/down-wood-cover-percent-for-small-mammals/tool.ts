import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  sum,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedDownWoodFootprintM2: readonly number[];
  readonly observedIndependentOverlapM2: number;
  readonly observedHabitatPlotM2: number;
}>;
export type Output = Readonly<{
  readonly overlapCorrectedDownWoodCoverFraction: number;
}>;
const inputFields = [
  {
    id: "observedDownWoodFootprintM2",
    label: "Observed down wood footprint m2",
    kind: "numberList",
  },
  {
    id: "observedIndependentOverlapM2",
    label: "Observed independent overlap m2",
    kind: "number",
  },
  {
    id: "observedHabitatPlotM2",
    label: "Observed habitat plot m2",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedHabitatPlotM2, "observedHabitatPlotM2");
  input.observedDownWoodFootprintM2.forEach((v) =>
    nonnegative(v, "observedDownWoodFootprintM2"),
  );
  nonnegative(
    input.observedIndependentOverlapM2,
    "observedIndependentOverlapM2",
  );
  const union =
    sum(input.observedDownWoodFootprintM2) - input.observedIndependentOverlapM2;
  if (union < 0 || union > input.observedHabitatPlotM2)
    simpleError(
      "union",
      "Independent overlap-corrected deadwood footprint must fit plot.",
    );
  return {
    overlapCorrectedDownWoodCoverFraction: union / input.observedHabitatPlotM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDownWoodFootprintM2: [2, 3],
  observedIndependentOverlapM2: 1,
  observedHabitatPlotM2: 10,
} satisfies Input;
export const exampleOutput = {
  overlapCorrectedDownWoodCoverFraction: 0.4,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/down-wood-cover-percent-for-small-mammals",
  title: "Down Wood Cover Percent For Small Mammals",
  description:
    "Audit actual downwood projected footprint after independent overlap correction, distinct from canopy/understory vegetation area, no small-mammal occupancy or habitat guarantee. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "overlapCorrectedDownWoodCoverFraction",
      label: "Overlap corrected down wood cover fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDownWoodFootprintM2:
        value.observedDownWoodFootprintM2 as readonly number[],
      observedIndependentOverlapM2:
        value.observedIndependentOverlapM2 as number,
      observedHabitatPlotM2: value.observedHabitatPlotM2 as number,
    }),
});
export const run = tool.execute;
export default tool;
