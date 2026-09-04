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
  readonly observedRemovedEdmVolumesMm3: readonly number[];
  readonly observedSparkOnSeconds: readonly number[];
  readonly observedMatchedElapsedSeconds: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSparkOnRemovalMm3Second: number;
  readonly observedElapsedRemovalMm3Second: number;
}>;
const inputFields = [
  {
    id: "observedRemovedEdmVolumesMm3",
    label: "Observed removed edm volumes mm3",
    kind: "numberList",
  },
  {
    id: "observedSparkOnSeconds",
    label: "Observed spark on seconds",
    kind: "numberList",
  },
  {
    id: "observedMatchedElapsedSeconds",
    label: "Observed matched elapsed seconds",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSparkOnSeconds.forEach((v) =>
    positive(v, "observedSparkOnSeconds"),
  );
  input.observedMatchedElapsedSeconds.forEach((v) =>
    positive(v, "observedMatchedElapsedSeconds"),
  );
  input.observedRemovedEdmVolumesMm3.forEach((v) =>
    nonnegative(v, "observedRemovedEdmVolumesMm3"),
  );
  aligned(
    input.observedRemovedEdmVolumesMm3,
    input.observedSparkOnSeconds,
    "observedRemovedEdmVolumesMm3",
  );
  aligned(
    input.observedRemovedEdmVolumesMm3,
    input.observedMatchedElapsedSeconds,
    "observedRemovedEdmVolumesMm3",
  );
  input.observedSparkOnSeconds.forEach((v, i) => {
    if (v > input.observedMatchedElapsedSeconds[i])
      simpleError("clock", "Spark-on≤elapsed observed interval.");
  });
  return {
    observedSparkOnRemovalMm3Second:
      sum(input.observedRemovedEdmVolumesMm3) /
      sum(input.observedSparkOnSeconds),
    observedElapsedRemovalMm3Second:
      sum(input.observedRemovedEdmVolumesMm3) /
      sum(input.observedMatchedElapsedSeconds),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedRemovedEdmVolumesMm3: [10, 20],
  observedSparkOnSeconds: [1, 2],
  observedMatchedElapsedSeconds: [2, 4],
} satisfies Input;
export const exampleOutput = {
  observedSparkOnRemovalMm3Second: 10,
  observedElapsedRemovalMm3Second: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/edm-removal-rate",
  title: "EDM Removal Rate Calculator",
  description:
    "Audit actual EDM removal versus spark-on AND total elapsed exposure, not rectangular cutting-speed MRR or predicted discharge energetics. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSparkOnRemovalMm3Second",
      label: "Observed spark on removal mm3 second",
      kind: "number",
    },
    {
      id: "observedElapsedRemovalMm3Second",
      label: "Observed elapsed removal mm3 second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedRemovedEdmVolumesMm3:
        value.observedRemovedEdmVolumesMm3 as readonly number[],
      observedSparkOnSeconds: value.observedSparkOnSeconds as readonly number[],
      observedMatchedElapsedSeconds:
        value.observedMatchedElapsedSeconds as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
