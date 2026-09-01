import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedCollectorIncidentWattsM2: readonly number[];
  readonly observedCollectorUsefulHeatWatts: readonly number[];
  readonly observedCollectorAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedCollectorEfficiencies: readonly number[];
  readonly pooledIncidentEnergyWeightedEfficiency: number;
}>;
const inputFields = [
  {
    id: "observedCollectorIncidentWattsM2",
    label: "Observed collector incident watts m2",
    kind: "numberList",
  },
  {
    id: "observedCollectorUsefulHeatWatts",
    label: "Observed collector useful heat watts",
    kind: "numberList",
  },
  {
    id: "observedCollectorAreasM2",
    label: "Observed collector areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedCollectorIncidentWattsM2.forEach((v) =>
    positive(v, "observedCollectorIncidentWattsM2"),
  );
  input.observedCollectorAreasM2.forEach((v) =>
    positive(v, "observedCollectorAreasM2"),
  );
  input.observedCollectorUsefulHeatWatts.forEach((v) =>
    nonnegative(v, "observedCollectorUsefulHeatWatts"),
  );
  aligned(
    input.observedCollectorIncidentWattsM2,
    input.observedCollectorUsefulHeatWatts,
    "observedCollectorIncidentWattsM2",
  );
  aligned(
    input.observedCollectorIncidentWattsM2,
    input.observedCollectorAreasM2,
    "observedCollectorIncidentWattsM2",
  );
  const incident = input.observedCollectorIncidentWattsM2.map(
    (v, i) => v * input.observedCollectorAreasM2[i],
  );
  return {
    observedCollectorEfficiencies: input.observedCollectorUsefulHeatWatts.map(
      (v, i) => v / incident[i],
    ),
    pooledIncidentEnergyWeightedEfficiency:
      sum(input.observedCollectorUsefulHeatWatts) / sum(incident),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCollectorIncidentWattsM2: [500, 800],
  observedCollectorUsefulHeatWatts: [1000, 2400],
  observedCollectorAreasM2: [4, 4],
} satisfies Input;
export const exampleOutput = {
  observedCollectorEfficiencies: [0.5, 0.75],
  pooledIncidentEnergyWeightedEfficiency: 0.6538461538461539,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/solar-thermal-collector-efficiency",
  title: "Plumbing Solar Thermal Collector Efficiency Calculator",
  description:
    "Audit actual simultaneous solar-collector useful/incident power with independent aperture area, pooling by incident power; ratios >1 retain mismatch evidence, no causal efficiency curve or heating guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCollectorEfficiencies",
      label: "Observed collector efficiencies",
      kind: "numberList",
    },
    {
      id: "pooledIncidentEnergyWeightedEfficiency",
      label: "Pooled incident energy weighted efficiency",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCollectorIncidentWattsM2:
        value.observedCollectorIncidentWattsM2 as readonly number[],
      observedCollectorUsefulHeatWatts:
        value.observedCollectorUsefulHeatWatts as readonly number[],
      observedCollectorAreasM2:
        value.observedCollectorAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
