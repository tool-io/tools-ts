import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  sum,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedNoiseLevelsDb: readonly number[];
  readonly observedExposureHours: readonly number[];
  readonly callerCriterionLevelDb: number;
  readonly callerCriterionHours: number;
  readonly callerExchangeRateDb: number;
}>;
export type Output = Readonly<{ readonly callerNoiseDosePercent: number }>;
const inputFields = [
  {
    id: "observedNoiseLevelsDb",
    label: "Observed noise levels db",
    kind: "numberList",
  },
  {
    id: "observedExposureHours",
    label: "Observed exposure hours",
    kind: "numberList",
  },
  {
    id: "callerCriterionLevelDb",
    label: "Caller criterion level db",
    kind: "number",
  },
  {
    id: "callerCriterionHours",
    label: "Caller criterion hours",
    kind: "number",
  },
  {
    id: "callerExchangeRateDb",
    label: "Caller exchange rate db",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerCriterionHours, "callerCriterionHours");
  positive(input.callerExchangeRateDb, "callerExchangeRateDb");
  input.observedExposureHours.forEach((v) =>
    nonnegative(v, "observedExposureHours"),
  );
  aligned(
    input.observedNoiseLevelsDb,
    input.observedExposureHours,
    "observedNoiseLevelsDb",
  );
  return {
    callerNoiseDosePercent:
      100 *
      sum(
        input.observedNoiseLevelsDb.map(
          (v, i) =>
            (input.observedExposureHours[i] / input.callerCriterionHours) *
            2 **
              ((v - input.callerCriterionLevelDb) / input.callerExchangeRateDb),
        ),
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedNoiseLevelsDb: [85, 90],
  observedExposureHours: [2, 2],
  callerCriterionLevelDb: 85,
  callerCriterionHours: 8,
  callerExchangeRateDb: 5,
} satisfies Input;
export const exampleOutput = { callerNoiseDosePercent: 75 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/noise-dose",
  title: "Noise Dose Calculator",
  description:
    "Caller explicitly verified threshold-free equal-energy/exchange-rate noise exposure budget, no jurisdiction defaults or hearing-safety certificate. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerNoiseDosePercent",
      label: "Caller noise dose percent",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedNoiseLevelsDb: value.observedNoiseLevelsDb as readonly number[],
      observedExposureHours: value.observedExposureHours as readonly number[],
      callerCriterionLevelDb: value.callerCriterionLevelDb as number,
      callerCriterionHours: value.callerCriterionHours as number,
      callerExchangeRateDb: value.callerExchangeRateDb as number,
    }),
});
export const run = tool.execute;
export default tool;
