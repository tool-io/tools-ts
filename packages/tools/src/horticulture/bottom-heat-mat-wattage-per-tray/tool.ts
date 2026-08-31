import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  bounded,
  aligned,
  sum,
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedMatElectricalWatts: readonly number[];
  readonly measuredActiveDutyFractions: readonly number[];
  readonly matchedHeatedTrayCounts: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledMeanHeatMatWattsByBank: readonly number[];
  readonly modeledWattsPerMatchedTray: readonly number[];
  readonly combinedMeanMatElectricalWatts: number;
}>;
const inputFields = [
  {
    id: "observedMatElectricalWatts",
    label: "Observed mat electrical watts",
    kind: "numberList",
  },
  {
    id: "measuredActiveDutyFractions",
    label: "Measured active duty fractions",
    kind: "numberList",
  },
  {
    id: "matchedHeatedTrayCounts",
    label: "Matched heated tray counts",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatElectricalWatts.forEach((v) =>
    nonnegative(v, "observedMatElectricalWatts"),
  );
  input.measuredActiveDutyFractions.forEach((v) =>
    fraction(v, "measuredActiveDutyFractions"),
  );
  aligned(
    input.observedMatElectricalWatts,
    input.measuredActiveDutyFractions,
    "observedMatElectricalWatts",
  );
  aligned(
    input.observedMatElectricalWatts,
    input.matchedHeatedTrayCounts,
    "observedMatElectricalWatts",
  );
  input.matchedHeatedTrayCounts.forEach((v) => bounded(v, "trays", 1, 1000000));
  const power = input.observedMatElectricalWatts.map(
    (v, i) => v * input.measuredActiveDutyFractions[i],
  );
  return {
    modeledMeanHeatMatWattsByBank: power,
    modeledWattsPerMatchedTray: power.map(
      (v, i) => v / input.matchedHeatedTrayCounts[i],
    ),
    combinedMeanMatElectricalWatts: sum(power),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMatElectricalWatts: [100, 150],
  measuredActiveDutyFractions: [0.5, 0.4],
  matchedHeatedTrayCounts: [2, 3],
} satisfies Input;
export const exampleOutput = {
  modeledMeanHeatMatWattsByBank: [50, 60],
  modeledWattsPerMatchedTray: [25, 20],
  combinedMeanMatElectricalWatts: 110,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/bottom-heat-mat-wattage-per-tray",
  title: "Bottom Heat Mat Wattage Per Tray Calculator",
  description:
    "Inventory actual heating-mat electrical measurements/duty per observed tray bank; not nominal wattage selection, root-zone thermal demand or electrical/fire safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledMeanHeatMatWattsByBank",
      label: "Modeled mean heat mat watts by bank",
      kind: "numberList",
    },
    {
      id: "modeledWattsPerMatchedTray",
      label: "Modeled watts per matched tray",
      kind: "numberList",
    },
    {
      id: "combinedMeanMatElectricalWatts",
      label: "Combined mean mat electrical watts",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMatElectricalWatts:
        value.observedMatElectricalWatts as readonly number[],
      measuredActiveDutyFractions:
        value.measuredActiveDutyFractions as readonly number[],
      matchedHeatedTrayCounts:
        value.matchedHeatedTrayCounts as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
