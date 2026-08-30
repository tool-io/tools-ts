import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  mean,
} from "../shared.js";
export type Input = Readonly<{
  readonly treatedBeforeVolumesM3PerHa: readonly number[];
  readonly treatedAfterVolumesM3PerHa: readonly number[];
  readonly controlBeforeVolumesM3PerHa: readonly number[];
  readonly controlAfterVolumesM3PerHa: readonly number[];
  readonly elapsedYears: readonly number[];
}>;
export type Output = Readonly<{
  readonly pairedControlAdjustedVolumeResponseM3PerHaYear: readonly number[];
  readonly meanControlAdjustedResponseM3PerHaYear: number;
}>;
const inputFields = [
  {
    id: "treatedBeforeVolumesM3PerHa",
    label: "Treated before volumes m3 per ha",
    kind: "numberList",
  },
  {
    id: "treatedAfterVolumesM3PerHa",
    label: "Treated after volumes m3 per ha",
    kind: "numberList",
  },
  {
    id: "controlBeforeVolumesM3PerHa",
    label: "Control before volumes m3 per ha",
    kind: "numberList",
  },
  {
    id: "controlAfterVolumesM3PerHa",
    label: "Control after volumes m3 per ha",
    kind: "numberList",
  },
  { id: "elapsedYears", label: "Elapsed years", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.elapsedYears.forEach((v) => positive(v, "elapsedYears"));
  input.treatedBeforeVolumesM3PerHa.forEach((v) =>
    nonnegative(v, "treatedBeforeVolumesM3PerHa"),
  );
  input.treatedAfterVolumesM3PerHa.forEach((v) =>
    nonnegative(v, "treatedAfterVolumesM3PerHa"),
  );
  input.controlBeforeVolumesM3PerHa.forEach((v) =>
    nonnegative(v, "controlBeforeVolumesM3PerHa"),
  );
  input.controlAfterVolumesM3PerHa.forEach((v) =>
    nonnegative(v, "controlAfterVolumesM3PerHa"),
  );
  aligned(
    input.treatedBeforeVolumesM3PerHa,
    input.treatedAfterVolumesM3PerHa,
    "treatedBeforeVolumesM3PerHa",
  );
  aligned(
    input.treatedBeforeVolumesM3PerHa,
    input.controlBeforeVolumesM3PerHa,
    "treatedBeforeVolumesM3PerHa",
  );
  aligned(
    input.treatedBeforeVolumesM3PerHa,
    input.controlAfterVolumesM3PerHa,
    "treatedBeforeVolumesM3PerHa",
  );
  aligned(
    input.treatedBeforeVolumesM3PerHa,
    input.elapsedYears,
    "treatedBeforeVolumesM3PerHa",
  );
  const pairedControlAdjustedVolumeResponseM3PerHaYear =
    input.treatedBeforeVolumesM3PerHa.map(
      (v, i) =>
        (input.treatedAfterVolumesM3PerHa[i] -
          v -
          input.controlAfterVolumesM3PerHa[i] +
          input.controlBeforeVolumesM3PerHa[i]) /
        input.elapsedYears[i],
    );
  return {
    pairedControlAdjustedVolumeResponseM3PerHaYear,
    meanControlAdjustedResponseM3PerHaYear: mean(
      pairedControlAdjustedVolumeResponseM3PerHaYear,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  treatedBeforeVolumesM3PerHa: [10, 20],
  treatedAfterVolumesM3PerHa: [20, 40],
  controlBeforeVolumesM3PerHa: [10, 20],
  controlAfterVolumesM3PerHa: [15, 30],
  elapsedYears: [1, 2],
} satisfies Input;
export const exampleOutput = {
  pairedControlAdjustedVolumeResponseM3PerHaYear: [5, 5],
  meanControlAdjustedResponseM3PerHaYear: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/fertilizer-nitrogen-response-m3-per-year-gain",
  title: "Nitrogen Fertilizer Response m³/yr Gain",
  description:
    "Calculate paired before/after/control annual volume-growth contrasts, retaining signed response; observational contrasts alone do not establish causal fertilizer efficacy or an application rate.",
  inputs: inputFields,
  outputs: [
    {
      id: "pairedControlAdjustedVolumeResponseM3PerHaYear",
      label: "Paired control adjusted volume response m3 per ha year",
      kind: "numberList",
    },
    {
      id: "meanControlAdjustedResponseM3PerHaYear",
      label: "Mean control adjusted response m3 per ha year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      treatedBeforeVolumesM3PerHa:
        value.treatedBeforeVolumesM3PerHa as readonly number[],
      treatedAfterVolumesM3PerHa:
        value.treatedAfterVolumesM3PerHa as readonly number[],
      controlBeforeVolumesM3PerHa:
        value.controlBeforeVolumesM3PerHa as readonly number[],
      controlAfterVolumesM3PerHa:
        value.controlAfterVolumesM3PerHa as readonly number[],
      elapsedYears: value.elapsedYears as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
