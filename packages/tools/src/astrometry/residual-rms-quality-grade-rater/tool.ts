import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  mean,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedResidualEastArcsec: readonly number[];
  readonly observedResidualNorthArcsec: readonly number[];
  readonly callerRmsReviewThresholdArcsec: number;
}>;
export type Output = Readonly<{
  readonly radialResidualRmsArcsec: number;
  readonly callerRmsReviewFlag: boolean;
}>;
const inputFields = [
  {
    id: "observedResidualEastArcsec",
    label: "Observed residual east arcsec",
    kind: "numberList",
  },
  {
    id: "observedResidualNorthArcsec",
    label: "Observed residual north arcsec",
    kind: "numberList",
  },
  {
    id: "callerRmsReviewThresholdArcsec",
    label: "Caller rms review threshold arcsec",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerRmsReviewThresholdArcsec,
    "callerRmsReviewThresholdArcsec",
  );
  aligned(
    input.observedResidualEastArcsec,
    input.observedResidualNorthArcsec,
    "observedResidualEastArcsec",
  );
  const r = Math.sqrt(
    mean(
      input.observedResidualEastArcsec.map(
        (v, i) => v * v + input.observedResidualNorthArcsec[i] ** 2,
      ),
    ),
  );
  return {
    radialResidualRmsArcsec: r,
    callerRmsReviewFlag: r > input.callerRmsReviewThresholdArcsec,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedResidualEastArcsec: [3, 0],
  observedResidualNorthArcsec: [4, 0],
  callerRmsReviewThresholdArcsec: 3,
} satisfies Input;
export const exampleOutput = {
  radialResidualRmsArcsec: 3.5355339059327373,
  callerRmsReviewFlag: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/residual-rms-quality-grade-rater",
  title: "Astrometric Residual RMS Scatter Quality Grade Rater",
  description:
    "Observed 2 Dradial residual RMS about zero (bias retained), not re-centered sample SD or reduced chi-square. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "radialResidualRmsArcsec",
      label: "Radial residual rms arcsec",
      kind: "number",
    },
    {
      id: "callerRmsReviewFlag",
      label: "Caller rms review flag",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedResidualEastArcsec:
        value.observedResidualEastArcsec as readonly number[],
      observedResidualNorthArcsec:
        value.observedResidualNorthArcsec as readonly number[],
      callerRmsReviewThresholdArcsec:
        value.callerRmsReviewThresholdArcsec as number,
    }),
});
export const run = tool.execute;
export default tool;
