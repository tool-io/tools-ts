import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned, ordered, maximum } from "../shared.js";

export type Input = Readonly<{
  readonly observationHours: readonly number[];
  readonly observedTemperaturesC: readonly number[];
}>;
export type Output = Readonly<{
  readonly intervalSignedCoolingRatesCPerHour: readonly number[];
  readonly maximumObservedCoolingRateCPerHour: number;
  readonly netCoolingC: number;
}>;
const inputFields = [
  { id: "observationHours", label: "Observation hours", kind: "numberList" },
  {
    id: "observedTemperaturesC",
    label: "Observed temperatures c",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.observationHours,
    input.observedTemperaturesC,
    "observationHours",
  );
  ordered(input.observationHours, "hours");
  const intervalSignedCoolingRatesCPerHour = input.observedTemperaturesC
    .slice(1)
    .map(
      (t, i) =>
        (input.observedTemperaturesC[i] - t) /
        (input.observationHours[i + 1] - input.observationHours[i]),
    );
  return {
    intervalSignedCoolingRatesCPerHour,
    maximumObservedCoolingRateCPerHour: maximum(
      intervalSignedCoolingRatesCPerHour,
    ),
    netCoolingC:
      input.observedTemperaturesC[0] - input.observedTemperaturesC.at(-1)!,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observationHours: [0, 1, 3],
  observedTemperaturesC: [20, 15, 13],
} satisfies Input;
export const exampleOutput = {
  intervalSignedCoolingRatesCPerHour: [5, 1],
  maximumObservedCoolingRateCPerHour: 5,
  netCoolingC: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/cold-front-passing-temp-drop-rate",
  title: "Cold Front Passing Temp Drop Rate",
  description:
    "Audit observed interval cooling rates over irregular hours while preserving warming sign; temperature change alone does not establish a cold-front passage or weather hazard.",
  inputs: inputFields,
  outputs: [
    {
      id: "intervalSignedCoolingRatesCPerHour",
      label: "Interval signed cooling rates c per hour",
      kind: "numberList",
    },
    {
      id: "maximumObservedCoolingRateCPerHour",
      label: "Maximum observed cooling rate c per hour",
      kind: "number",
    },
    { id: "netCoolingC", label: "Net cooling c", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observationHours: value.observationHours as readonly number[],
      observedTemperaturesC: value.observedTemperaturesC as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
