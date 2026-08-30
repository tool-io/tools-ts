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
  regression,
  maximum,
  minimum,
} from "../shared.js";
export type Input = Readonly<{
  readonly previousEruptionDreVolumesM3: readonly number[];
  readonly subsequentReposeIntervalsYears: readonly number[];
  readonly lastEruptionDreVolumeM3: number;
  readonly lastEruptionYear: number;
}>;
export type Output = Readonly<{
  readonly fittedRechargeYearsPerM3: number;
  readonly modelNextIntervalYears: number;
  readonly modelNextEruptionYear: number;
  readonly fitRSquared: number;
}>;
const inputFields = [
  {
    id: "previousEruptionDreVolumesM3",
    label: "Previous eruption dre volumes m3",
    kind: "numberList",
  },
  {
    id: "subsequentReposeIntervalsYears",
    label: "Subsequent repose intervals years",
    kind: "numberList",
  },
  {
    id: "lastEruptionDreVolumeM3",
    label: "Last eruption dre volume m3",
    kind: "number",
  },
  { id: "lastEruptionYear", label: "Last eruption year", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.previousEruptionDreVolumesM3.forEach((v) =>
    positive(v, "previousEruptionDreVolumesM3"),
  );
  input.subsequentReposeIntervalsYears.forEach((v) =>
    positive(v, "subsequentReposeIntervalsYears"),
  );
  positive(input.lastEruptionDreVolumeM3, "lastEruptionDreVolumeM3");
  const fit = regression(
    input.previousEruptionDreVolumesM3,
    input.subsequentReposeIntervalsYears,
  );
  positive(fit.slope, "rechargeSlope");
  if (
    input.lastEruptionDreVolumeM3 <
      minimum(input.previousEruptionDreVolumesM3) ||
    input.lastEruptionDreVolumeM3 > maximum(input.previousEruptionDreVolumesM3)
  )
    simpleError(
      "lastEruptionDreVolumeM3",
      "Last volume must lie within calibration; no extrapolation.",
    );
  const modelNextIntervalYears = positive(
    fit.intercept + fit.slope * input.lastEruptionDreVolumeM3,
    "interval",
  );
  return {
    fittedRechargeYearsPerM3: fit.slope,
    modelNextIntervalYears,
    modelNextEruptionYear: input.lastEruptionYear + modelNextIntervalYears,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  previousEruptionDreVolumesM3: [1, 2, 3],
  subsequentReposeIntervalsYears: [2, 4, 6],
  lastEruptionDreVolumeM3: 2.5,
  lastEruptionYear: 2000,
} satisfies Input;
export const exampleOutput = {
  fittedRechargeYearsPerM3: 2,
  modelNextIntervalYears: 5,
  modelNextEruptionYear: 2005,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/time-predictable-next-eruption-estimate",
  title: "Time Predictable Next Eruption Estimator",
  description:
    "Fit the time-predictable previous-eruption-volume/subsequent-repose hypothesis and interpolate a last-volume scenario; this historical calibration is not a reliable next-eruption date or an uncertainty interval.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedRechargeYearsPerM3",
      label: "Fitted recharge years per m3",
      kind: "number",
    },
    {
      id: "modelNextIntervalYears",
      label: "Model next interval years",
      kind: "number",
    },
    {
      id: "modelNextEruptionYear",
      label: "Model next eruption year",
      kind: "number",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      previousEruptionDreVolumesM3:
        value.previousEruptionDreVolumesM3 as readonly number[],
      subsequentReposeIntervalsYears:
        value.subsequentReposeIntervalsYears as readonly number[],
      lastEruptionDreVolumeM3: value.lastEruptionDreVolumeM3 as number,
      lastEruptionYear: value.lastEruptionYear as number,
    }),
});
export const run = tool.execute;
export default tool;
