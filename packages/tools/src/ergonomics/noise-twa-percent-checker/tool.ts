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
  fraction,
  aligned,
  sum,
} from "../shared.js";
export type Input = Readonly<{
  readonly observedSoundLevelsDb: readonly number[];
  readonly representedExposureHours: readonly number[];
  readonly callerCriterionDb: number;
  readonly callerCriterionHours: number;
  readonly callerExchangeRateDb: number;
  readonly callerDoseLimitPercent: number;
}>;
export type Output = Readonly<{
  readonly callerModelNoiseDosePercent: number;
  readonly callerModelEquivalentTwaDb: number;
  readonly aboveCallerDoseLimit: boolean;
}>;
const inputFields = [
  {
    id: "observedSoundLevelsDb",
    label: "Observed sound levels db",
    kind: "numberList",
  },
  {
    id: "representedExposureHours",
    label: "Represented exposure hours",
    kind: "numberList",
  },
  { id: "callerCriterionDb", label: "Caller criterion db", kind: "number" },
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
  {
    id: "callerDoseLimitPercent",
    label: "Caller dose limit percent",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerCriterionHours, "callerCriterionHours");
  positive(input.callerExchangeRateDb, "callerExchangeRateDb");
  input.representedExposureHours.forEach((v) =>
    nonnegative(v, "representedExposureHours"),
  );
  nonnegative(input.callerDoseLimitPercent, "callerDoseLimitPercent");
  aligned(
    input.observedSoundLevelsDb,
    input.representedExposureHours,
    "observedSoundLevelsDb",
  );
  if (sum(input.representedExposureHours) > 24)
    simpleError(
      "hours",
      "At most 24 daily represented exposure hours required.",
    );
  const fraction = positive(
      input.observedSoundLevelsDb.reduce(
        (s, v, i) =>
          s +
          (input.representedExposureHours[i] / input.callerCriterionHours) *
            2 ** ((v - input.callerCriterionDb) / input.callerExchangeRateDb),
        0,
      ),
      "dose",
    ),
    dose = 100 * fraction;
  return {
    callerModelNoiseDosePercent: dose,
    callerModelEquivalentTwaDb:
      input.callerCriterionDb +
      input.callerExchangeRateDb * Math.log2(fraction),
    aboveCallerDoseLimit: dose > input.callerDoseLimitPercent,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedSoundLevelsDb: [85, 88],
  representedExposureHours: [2, 1],
  callerCriterionDb: 85,
  callerCriterionHours: 8,
  callerExchangeRateDb: 3,
  callerDoseLimitPercent: 100,
} satisfies Input;
export const exampleOutput = {
  callerModelNoiseDosePercent: 50,
  callerModelEquivalentTwaDb: 82,
  aboveCallerDoseLimit: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/noise-twa-percent-checker",
  title: "Noise Dose Ergonomic TWA Percent Checker",
  description:
    "Compute daily dose/TWA under explicit caller criterion duration/level and exchange rate, not hidden OSHA/NIOSH thresholds or generic acoustic energy/SEL aggregation; supplied levels already weighted, no hearing-safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerModelNoiseDosePercent",
      label: "Caller model noise dose percent",
      kind: "number",
    },
    {
      id: "callerModelEquivalentTwaDb",
      label: "Caller model equivalent twa db",
      kind: "number",
    },
    {
      id: "aboveCallerDoseLimit",
      label: "Above caller dose limit",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedSoundLevelsDb: value.observedSoundLevelsDb as readonly number[],
      representedExposureHours:
        value.representedExposureHours as readonly number[],
      callerCriterionDb: value.callerCriterionDb as number,
      callerCriterionHours: value.callerCriterionHours as number,
      callerExchangeRateDb: value.callerExchangeRateDb as number,
      callerDoseLimitPercent: value.callerDoseLimitPercent as number,
    }),
});
export const run = tool.execute;
export default tool;
