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
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesDays: readonly number[];
  readonly measuredSo2TonnesPerDay: readonly number[];
  readonly callerEscalationLogRatePerDay: number;
  readonly callerComparisonFluxTonnesPerDay: number;
}>;
export type Output = Readonly<{
  readonly fittedLogGrowthRatePerDay: number;
  readonly modelComparisonFluxDay: number;
  readonly aboveCallerEscalationRate: boolean;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "timesDays", label: "Times days", kind: "numberList" },
  {
    id: "measuredSo2TonnesPerDay",
    label: "Measured so2 tonnes per day",
    kind: "numberList",
  },
  {
    id: "callerEscalationLogRatePerDay",
    label: "Caller escalation log rate per day",
    kind: "number",
  },
  {
    id: "callerComparisonFluxTonnesPerDay",
    label: "Caller comparison flux tonnes per day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredSo2TonnesPerDay.forEach((v) =>
    positive(v, "measuredSo2TonnesPerDay"),
  );
  positive(
    input.callerComparisonFluxTonnesPerDay,
    "callerComparisonFluxTonnesPerDay",
  );
  ordered(input.timesDays, "timesDays");
  const fit = regression(
    input.timesDays,
    input.measuredSo2TonnesPerDay.map(Math.log),
  );
  if (fit.slope <= 0)
    simpleError(
      "measuredSo2TonnesPerDay",
      "A positive fitted log growth rate is required for a future comparison timing.",
    );
  const modelComparisonFluxDay =
    (Math.log(input.callerComparisonFluxTonnesPerDay) - fit.intercept) /
    fit.slope;
  if (modelComparisonFluxDay < input.timesDays.at(-1)!)
    simpleError(
      "callerComparisonFluxTonnesPerDay",
      "Model comparison is before last observation, not a future crossing.",
    );
  return {
    fittedLogGrowthRatePerDay: fit.slope,
    modelComparisonFluxDay,
    aboveCallerEscalationRate: fit.slope > input.callerEscalationLogRatePerDay,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesDays: [0, 1, 2],
  measuredSo2TonnesPerDay: [10, 20, 40],
  callerEscalationLogRatePerDay: 0.5,
  callerComparisonFluxTonnesPerDay: 80,
} satisfies Input;
export const exampleOutput = {
  fittedLogGrowthRatePerDay: 0.6931471805599453,
  modelComparisonFluxDay: 3,
  aboveCallerEscalationRate: true,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/so2-flux-trend-escalation-checker",
  title: "SO2 Flux Trend Escalation Checker",
  description:
    "Monitor observed SO2 multiplicative growth and extrapolated caller flux timing; model assumes unchanged trend and is not an eruption escalation/alert forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "fittedLogGrowthRatePerDay",
      label: "Fitted log growth rate per day",
      kind: "number",
    },
    {
      id: "modelComparisonFluxDay",
      label: "Model comparison flux day",
      kind: "number",
    },
    {
      id: "aboveCallerEscalationRate",
      label: "Above caller escalation rate",
      kind: "boolean",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesDays: value.timesDays as readonly number[],
      measuredSo2TonnesPerDay:
        value.measuredSo2TonnesPerDay as readonly number[],
      callerEscalationLogRatePerDay:
        value.callerEscalationLogRatePerDay as number,
      callerComparisonFluxTonnesPerDay:
        value.callerComparisonFluxTonnesPerDay as number,
    }),
});
export const run = tool.execute;
export default tool;
