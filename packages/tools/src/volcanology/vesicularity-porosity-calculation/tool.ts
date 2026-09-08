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
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedVesicleVolumesMm3: readonly number[];
  readonly observedMatchedWholeRockVolumesMm3: readonly number[];
  readonly observedOpenConnectedVesicleVolumesMm3: readonly number[];
}>;
export type Output = Readonly<{
  readonly pooledVesicularityFraction: number;
  readonly connectedVesicleFractionOfWhole: number;
}>;
const inputFields = [
  {
    id: "observedVesicleVolumesMm3",
    label: "Observed vesicle volumes mm3",
    kind: "numberList",
  },
  {
    id: "observedMatchedWholeRockVolumesMm3",
    label: "Observed matched whole rock volumes mm3",
    kind: "numberList",
  },
  {
    id: "observedOpenConnectedVesicleVolumesMm3",
    label: "Observed open connected vesicle volumes mm3",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedMatchedWholeRockVolumesMm3.forEach((v) =>
    positive(v, "observedMatchedWholeRockVolumesMm3"),
  );
  input.observedVesicleVolumesMm3.forEach((v) =>
    nonnegative(v, "observedVesicleVolumesMm3"),
  );
  input.observedOpenConnectedVesicleVolumesMm3.forEach((v) =>
    nonnegative(v, "observedOpenConnectedVesicleVolumesMm3"),
  );
  aligned(
    input.observedVesicleVolumesMm3,
    input.observedMatchedWholeRockVolumesMm3,
    "observedVesicleVolumesMm3",
  );
  aligned(
    input.observedVesicleVolumesMm3,
    input.observedOpenConnectedVesicleVolumesMm3,
    "observedVesicleVolumesMm3",
  );
  input.observedVesicleVolumesMm3.forEach((v, i) => {
    if (
      v > input.observedMatchedWholeRockVolumesMm3[i] ||
      input.observedOpenConnectedVesicleVolumesMm3[i] > v
    )
      simpleError("vesicles", "Connected≤all vesicles≤whole specimen.");
  });
  const total = sum(input.observedMatchedWholeRockVolumesMm3);
  return {
    pooledVesicularityFraction: sum(input.observedVesicleVolumesMm3) / total,
    connectedVesicleFractionOfWhole:
      sum(input.observedOpenConnectedVesicleVolumesMm3) / total,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedVesicleVolumesMm3: [1, 3],
  observedMatchedWholeRockVolumesMm3: [10, 20],
  observedOpenConnectedVesicleVolumesMm3: [0.5, 1],
} satisfies Input;
export const exampleOutput = {
  pooledVesicularityFraction: 0.13333333333333333,
  connectedVesicleFractionOfWhole: 0.05,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/vesicularity-porosity-calculation",
  title: "Vesicularity Porosity Calculation Tool",
  description:
    "Actual matched whole/all/open-vesicle specimen volumes, closed vesicles distinguished from connected porosity; not generic void ratio or rock identity. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "pooledVesicularityFraction",
      label: "Pooled vesicularity fraction",
      kind: "number",
    },
    {
      id: "connectedVesicleFractionOfWhole",
      label: "Connected vesicle fraction of whole",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedVesicleVolumesMm3:
        value.observedVesicleVolumesMm3 as readonly number[],
      observedMatchedWholeRockVolumesMm3:
        value.observedMatchedWholeRockVolumesMm3 as readonly number[],
      observedOpenConnectedVesicleVolumesMm3:
        value.observedOpenConnectedVesicleVolumesMm3 as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
