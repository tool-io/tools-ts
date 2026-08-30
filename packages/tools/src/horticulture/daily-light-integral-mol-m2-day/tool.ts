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
  aligned,
  integral,
} from "../shared.js";
export type Input = Readonly<{
  readonly sampleTimesHours: readonly number[];
  readonly ppfdMicromolesPerM2Second: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedLightIntegralMolPerM2: number;
  readonly observationDurationHours: number;
  readonly meanPpfdMicromolesPerM2Second: number;
}>;
const inputFields = [
  { id: "sampleTimesHours", label: "Sample times hours", kind: "numberList" },
  {
    id: "ppfdMicromolesPerM2Second",
    label: "Ppfd micromoles per m2 second",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.ppfdMicromolesPerM2Second.forEach((v) =>
    nonnegative(v, "ppfdMicromolesPerM2Second"),
  );
  aligned(
    input.sampleTimesHours,
    input.ppfdMicromolesPerM2Second,
    "sampleTimesHours",
  );
  const area = integral(
      input.sampleTimesHours,
      input.ppfdMicromolesPerM2Second,
    ),
    observationDurationHours =
      input.sampleTimesHours.at(-1)! - input.sampleTimesHours[0];
  if (observationDurationHours > 24)
    simpleError(
      "sampleTimesHours",
      "Observation cannot span more than one 24-hour day.",
    );
  return {
    observedLightIntegralMolPerM2: area * 0.0036,
    observationDurationHours,
    meanPpfdMicromolesPerM2Second: area / observationDurationHours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sampleTimesHours: [0, 1, 2],
  ppfdMicromolesPerM2Second: [0, 100, 0],
} satisfies Input;
export const exampleOutput = {
  observedLightIntegralMolPerM2: 0.36,
  observationDurationHours: 2,
  meanPpfdMicromolesPerM2Second: 50,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/daily-light-integral-mol-m2-day",
  title: "Daily Light Integral MOL M2 Day",
  description:
    "Integrate measured time-varying PPFD by trapezoids into observed daily photon dose; unobserved hours are not silently filled and a constant PPFD-to-DLI alias is excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedLightIntegralMolPerM2",
      label: "Observed light integral mol per m2",
      kind: "number",
    },
    {
      id: "observationDurationHours",
      label: "Observation duration hours",
      kind: "number",
    },
    {
      id: "meanPpfdMicromolesPerM2Second",
      label: "Mean ppfd micromoles per m2 second",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sampleTimesHours: value.sampleTimesHours as readonly number[],
      ppfdMicromolesPerM2Second:
        value.ppfdMicromolesPerM2Second as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
