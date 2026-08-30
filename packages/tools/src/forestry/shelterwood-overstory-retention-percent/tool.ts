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
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly preHarvestOverstoryBasalAreaM2: readonly number[];
  readonly retainedOverstoryBasalAreaM2: readonly number[];
  readonly representedPlotAreasHa: readonly number[];
}>;
export type Output = Readonly<{
  readonly retainedBasalAreaPercent: number;
  readonly removedBasalAreaPercent: number;
  readonly retainedBasalAreaM2PerHa: number;
}>;
const inputFields = [
  {
    id: "preHarvestOverstoryBasalAreaM2",
    label: "Pre harvest overstory basal area m2",
    kind: "numberList",
  },
  {
    id: "retainedOverstoryBasalAreaM2",
    label: "Retained overstory basal area m2",
    kind: "numberList",
  },
  {
    id: "representedPlotAreasHa",
    label: "Represented plot areas ha",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.representedPlotAreasHa.forEach((v) =>
    positive(v, "representedPlotAreasHa"),
  );
  input.preHarvestOverstoryBasalAreaM2.forEach((v) =>
    nonnegative(v, "preHarvestOverstoryBasalAreaM2"),
  );
  input.retainedOverstoryBasalAreaM2.forEach((v) =>
    nonnegative(v, "retainedOverstoryBasalAreaM2"),
  );
  aligned(
    input.preHarvestOverstoryBasalAreaM2,
    input.retainedOverstoryBasalAreaM2,
    "preHarvestOverstoryBasalAreaM2",
  );
  aligned(
    input.preHarvestOverstoryBasalAreaM2,
    input.representedPlotAreasHa,
    "preHarvestOverstoryBasalAreaM2",
  );
  if (
    input.retainedOverstoryBasalAreaM2.some(
      (v, i) => v > input.preHarvestOverstoryBasalAreaM2[i],
    )
  )
    simpleError(
      "retained",
      "Retained area cannot exceed matched original inventory.",
    );
  const before = positive(
      input.preHarvestOverstoryBasalAreaM2.reduce((a, b) => a + b, 0),
      "before",
    ),
    after = input.retainedOverstoryBasalAreaM2.reduce((a, b) => a + b, 0),
    retainedBasalAreaPercent = (100 * after) / before;
  return {
    retainedBasalAreaPercent,
    removedBasalAreaPercent: 100 - retainedBasalAreaPercent,
    retainedBasalAreaM2PerHa:
      after / input.representedPlotAreasHa.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  preHarvestOverstoryBasalAreaM2: [10, 20],
  retainedOverstoryBasalAreaM2: [8, 10],
  representedPlotAreasHa: [1, 2],
} satisfies Input;
export const exampleOutput = {
  retainedBasalAreaPercent: 60,
  removedBasalAreaPercent: 40,
  retainedBasalAreaM2PerHa: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/shelterwood-overstory-retention-percent",
  title: "Shelterwood Overstory Retention Percent",
  description:
    "Summarize matched original/retained overstory basal-area inventories and represented area; not single-tree basal area, canopy cover or a regeneration guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "retainedBasalAreaPercent",
      label: "Retained basal area percent",
      kind: "number",
    },
    {
      id: "removedBasalAreaPercent",
      label: "Removed basal area percent",
      kind: "number",
    },
    {
      id: "retainedBasalAreaM2PerHa",
      label: "Retained basal area m2 per ha",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      preHarvestOverstoryBasalAreaM2:
        value.preHarvestOverstoryBasalAreaM2 as readonly number[],
      retainedOverstoryBasalAreaM2:
        value.retainedOverstoryBasalAreaM2 as readonly number[],
      representedPlotAreasHa: value.representedPlotAreasHa as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
