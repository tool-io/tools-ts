import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
  weights,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedCatchCanWaterMm: readonly number[];
  readonly observedTestMinutes: number;
  readonly representedCatchCanAreasM2: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedPrecipitationMmHour: readonly number[];
  readonly areaWeightedPrecipitationMmHour: number;
}>;
const inputFields = [
  {
    id: "observedCatchCanWaterMm",
    label: "Observed catch can water mm",
    kind: "numberList",
  },
  { id: "observedTestMinutes", label: "Observed test minutes", kind: "number" },
  {
    id: "representedCatchCanAreasM2",
    label: "Represented catch can areas m2",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedTestMinutes, "observedTestMinutes");
  input.representedCatchCanAreasM2.forEach((v) =>
    positive(v, "representedCatchCanAreasM2"),
  );
  input.observedCatchCanWaterMm.forEach((v) =>
    nonnegative(v, "observedCatchCanWaterMm"),
  );
  aligned(
    input.observedCatchCanWaterMm,
    input.representedCatchCanAreasM2,
    "observedCatchCanWaterMm",
  );
  const rates = input.observedCatchCanWaterMm.map(
      (v) => (v * 60) / input.observedTestMinutes,
    ),
    w = weights(input.representedCatchCanAreasM2);
  return {
    observedPrecipitationMmHour: rates,
    areaWeightedPrecipitationMmHour: sum(rates.map((v, i) => v * w[i])),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedCatchCanWaterMm: [2, 4, 6],
  observedTestMinutes: 10,
  representedCatchCanAreasM2: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  observedPrecipitationMmHour: [12, 24, 36],
  areaWeightedPrecipitationMmHour: 24,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/sprinkler-precipitation-rate",
  title: "Plumbing Sprinkler Precipitation Rate Calculator",
  description:
    "Calibrate actual timed sprinkler catch-can depths weighted by represented area; not inferred nozzle flow divided by nominal rectangle or universal application rate.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedPrecipitationMmHour",
      label: "Observed precipitation mm hour",
      kind: "numberList",
    },
    {
      id: "areaWeightedPrecipitationMmHour",
      label: "Area weighted precipitation mm hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedCatchCanWaterMm:
        value.observedCatchCanWaterMm as readonly number[],
      observedTestMinutes: value.observedTestMinutes as number,
      representedCatchCanAreasM2:
        value.representedCatchCanAreasM2 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
