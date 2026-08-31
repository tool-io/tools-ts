import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly initialOxygenMgLiter: number;
  readonly finalOxygenMgLiter: number;
  readonly matchedHypolimnionVolumeM3: number;
  readonly elapsedDays: number;
  readonly independentNetAdvectedOxygenKg: number;
}>;
export type Output = Readonly<{
  readonly observedInventoryChangeKg: number;
  readonly inferredNonAdvectiveOxygenDemandKgDay: number;
}>;
const inputFields = [
  {
    id: "initialOxygenMgLiter",
    label: "Initial oxygen mg liter",
    kind: "number",
  },
  { id: "finalOxygenMgLiter", label: "Final oxygen mg liter", kind: "number" },
  {
    id: "matchedHypolimnionVolumeM3",
    label: "Matched hypolimnion volume m3",
    kind: "number",
  },
  { id: "elapsedDays", label: "Elapsed days", kind: "number" },
  {
    id: "independentNetAdvectedOxygenKg",
    label: "Independent net advected oxygen kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.matchedHypolimnionVolumeM3, "matchedHypolimnionVolumeM3");
  positive(input.elapsedDays, "elapsedDays");
  nonnegative(input.initialOxygenMgLiter, "initialOxygenMgLiter");
  nonnegative(input.finalOxygenMgLiter, "finalOxygenMgLiter");
  const change =
    ((input.finalOxygenMgLiter - input.initialOxygenMgLiter) *
      input.matchedHypolimnionVolumeM3) /
    1000;
  return {
    observedInventoryChangeKg: change,
    inferredNonAdvectiveOxygenDemandKgDay:
      (input.independentNetAdvectedOxygenKg - change) / input.elapsedDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialOxygenMgLiter: 10,
  finalOxygenMgLiter: 8,
  matchedHypolimnionVolumeM3: 1000,
  elapsedDays: 2,
  independentNetAdvectedOxygenKg: 1,
} satisfies Input;
export const exampleOutput = {
  observedInventoryChangeKg: -2,
  inferredNonAdvectiveOxygenDemandKgDay: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/hypolimnetic-oxygen-demand-rate",
  title: "Hypolimnetic Oxygen Demand Rate Calculator",
  description:
    "Infer matched two-time hypolimnetic demand after independent net advected oxygen correction; distinct from OLS areal depletion fit, signed net replenishment retained and missing processes not uniquely diagnosed.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedInventoryChangeKg",
      label: "Observed inventory change kg",
      kind: "number",
    },
    {
      id: "inferredNonAdvectiveOxygenDemandKgDay",
      label: "Inferred non advective oxygen demand kg day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialOxygenMgLiter: value.initialOxygenMgLiter as number,
      finalOxygenMgLiter: value.finalOxygenMgLiter as number,
      matchedHypolimnionVolumeM3: value.matchedHypolimnionVolumeM3 as number,
      elapsedDays: value.elapsedDays as number,
      independentNetAdvectedOxygenKg:
        value.independentNetAdvectedOxygenKg as number,
    }),
});
export const run = tool.execute;
export default tool;
