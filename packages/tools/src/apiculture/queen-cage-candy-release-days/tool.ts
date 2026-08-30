import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  ordered,
  regression,
} from "../shared.js";
export type Input = Readonly<{
  readonly timesDays: readonly number[];
  readonly measuredRemainingCandyGrams: readonly number[];
  readonly callerBarrierReleaseMassGrams: number;
}>;
export type Output = Readonly<{
  readonly modeledBarrierReleaseDay: number;
  readonly isExtrapolatedBeyondObservation: boolean;
  readonly fitRSquared: number;
}>;
const inputFields = [
  { id: "timesDays", label: "Times days", kind: "numberList" },
  {
    id: "measuredRemainingCandyGrams",
    label: "Measured remaining candy grams",
    kind: "numberList",
  },
  {
    id: "callerBarrierReleaseMassGrams",
    label: "Caller barrier release mass grams",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.measuredRemainingCandyGrams.forEach((v) =>
    nonnegative(v, "measuredRemainingCandyGrams"),
  );
  nonnegative(
    input.callerBarrierReleaseMassGrams,
    "callerBarrierReleaseMassGrams",
  );
  ordered(input.timesDays, "timesDays");
  const fit = regression(input.timesDays, input.measuredRemainingCandyGrams);
  if (fit.slope >= 0)
    simpleError(
      "measuredRemainingCandyGrams",
      "Declining candy mass required for a finite release-mass forecast.",
    );
  const modeledBarrierReleaseDay =
    (input.callerBarrierReleaseMassGrams - fit.intercept) / fit.slope;
  if (modeledBarrierReleaseDay < input.timesDays[0])
    simpleError(
      "callerBarrierReleaseMassGrams",
      "Model release criterion already exceeded before observation; left-censored.",
    );
  return {
    modeledBarrierReleaseDay,
    isExtrapolatedBeyondObservation:
      modeledBarrierReleaseDay > input.timesDays.at(-1)!,
    fitRSquared: fit.rSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  timesDays: [0, 1, 2],
  measuredRemainingCandyGrams: [10, 8, 6],
  callerBarrierReleaseMassGrams: 0,
} satisfies Input;
export const exampleOutput = {
  modeledBarrierReleaseDay: 5,
  isExtrapolatedBeyondObservation: true,
  fitRSquared: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/queen-cage-candy-release-days",
  title: "Queen Cage Candy Release Days",
  description:
    "Extrapolate a measured candy-mass trend to a caller barrier criterion; this forecasts mass only, not actual queen release, acceptance or an instruction to open a cage.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledBarrierReleaseDay",
      label: "Modeled barrier release day",
      kind: "number",
    },
    {
      id: "isExtrapolatedBeyondObservation",
      label: "Is extrapolated beyond observation",
      kind: "boolean",
    },
    { id: "fitRSquared", label: "Fit r squared", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      timesDays: value.timesDays as readonly number[],
      measuredRemainingCandyGrams:
        value.measuredRemainingCandyGrams as readonly number[],
      callerBarrierReleaseMassGrams:
        value.callerBarrierReleaseMassGrams as number,
    }),
});
export const run = tool.execute;
export default tool;
