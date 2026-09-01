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
} from "../batch34-shared.js";
export type Input = Readonly<{
  readonly observedIntervalMeanCallusTemperaturesC: readonly number[];
  readonly observedIntervalHours: readonly number[];
  readonly callerCallusBaseTemperatureC: number;
  readonly callerCallusThermalCapC: number;
  readonly callerRequiredCallusDegreeDays: number;
}>;
export type Output = Readonly<{
  readonly observedCallusThermalContributionsDegreeDays: readonly number[];
  readonly observedCallusDegreeDays: number;
  readonly callerThermalBudgetReached: boolean;
}>;
const inputFields = [
  {
    id: "observedIntervalMeanCallusTemperaturesC",
    label: "Observed interval mean callus temperatures c",
    kind: "numberList",
  },
  {
    id: "observedIntervalHours",
    label: "Observed interval hours",
    kind: "numberList",
  },
  {
    id: "callerCallusBaseTemperatureC",
    label: "Caller callus base temperature c",
    kind: "number",
  },
  {
    id: "callerCallusThermalCapC",
    label: "Caller callus thermal cap c",
    kind: "number",
  },
  {
    id: "callerRequiredCallusDegreeDays",
    label: "Caller required callus degree days",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedIntervalHours.forEach((v) =>
    positive(v, "observedIntervalHours"),
  );
  aligned(
    input.observedIntervalMeanCallusTemperaturesC,
    input.observedIntervalHours,
    "observedIntervalMeanCallusTemperaturesC",
  );
  if (input.callerCallusThermalCapC <= input.callerCallusBaseTemperatureC)
    simpleError("thermal", "Caller thermal cap must exceed base.");
  nonnegative(input.callerRequiredCallusDegreeDays, "target");
  const doses = input.observedIntervalMeanCallusTemperaturesC.map(
      (v, i) =>
        (Math.max(
          0,
          Math.min(v, input.callerCallusThermalCapC) -
            input.callerCallusBaseTemperatureC,
        ) *
          input.observedIntervalHours[i]) /
        24,
    ),
    total = sum(doses);
  return {
    observedCallusThermalContributionsDegreeDays: doses,
    observedCallusDegreeDays: total,
    callerThermalBudgetReached: total >= input.callerRequiredCallusDegreeDays,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIntervalMeanCallusTemperaturesC: [20, 30, 40],
  observedIntervalHours: [12, 12, 12],
  callerCallusBaseTemperatureC: 15,
  callerCallusThermalCapC: 35,
  callerRequiredCallusDegreeDays: 20,
} satisfies Input;
export const exampleOutput = {
  observedCallusThermalContributionsDegreeDays: [2.5, 7.5, 10],
  observedCallusDegreeDays: 20,
  callerThermalBudgetReached: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "viticulture/bench-graft-callusing-degree-days",
  title: "Bench Graft Callusing Degree Days Calculator",
  description:
    "Audit actual bench-graft callusing temperature exposure with independently supplied thermal cap/base/target; hourly durations not daily season Huglin/BEDD, no germination, graft take or heating prescription.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCallusThermalContributionsDegreeDays",
      label: "Observed callus thermal contributions degree days",
      kind: "numberList",
    },
    {
      id: "observedCallusDegreeDays",
      label: "Observed callus degree days",
      kind: "number",
    },
    {
      id: "callerThermalBudgetReached",
      label: "Caller thermal budget reached",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIntervalMeanCallusTemperaturesC:
        value.observedIntervalMeanCallusTemperaturesC as readonly number[],
      observedIntervalHours: value.observedIntervalHours as readonly number[],
      callerCallusBaseTemperatureC:
        value.callerCallusBaseTemperatureC as number,
      callerCallusThermalCapC: value.callerCallusThermalCapC as number,
      callerRequiredCallusDegreeDays:
        value.callerRequiredCallusDegreeDays as number,
    }),
});
export const run = tool.execute;
export default tool;
