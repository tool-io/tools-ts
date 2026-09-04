import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, muskingum } from "../batch38-shared.js";
export type Input = Readonly<{
  readonly observedUniformStepInflowsM3Second: readonly number[];
  readonly initialOutflowM3Second: number;
  readonly storageKSeconds: number;
  readonly weightingX: number;
  readonly timeStepSeconds: number;
}>;
export type Output = Readonly<{
  readonly muskingumRoutedOutflowsM3Second: readonly number[];
}>;
const inputFields = [
  {
    id: "observedUniformStepInflowsM3Second",
    label: "Observed uniform step inflows m3 second",
    kind: "numberList",
  },
  {
    id: "initialOutflowM3Second",
    label: "Initial outflow m3 second",
    kind: "number",
  },
  { id: "storageKSeconds", label: "Storage k seconds", kind: "number" },
  { id: "weightingX", label: "Weighting x", kind: "number" },
  { id: "timeStepSeconds", label: "Time step seconds", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    muskingumRoutedOutflowsM3Second: muskingum(
      input.observedUniformStepInflowsM3Second,
      input.initialOutflowM3Second,
      input.storageKSeconds,
      input.weightingX,
      input.timeStepSeconds,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedUniformStepInflowsM3Second: [0, 10, 0],
  initialOutflowM3Second: 0,
  storageKSeconds: 1,
  weightingX: 0.25,
  timeStepSeconds: 1,
} satisfies Input;
export const exampleOutput = {
  muskingumRoutedOutflowsM3Second: [0, 2, 6.4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/flood-routing-muskingum",
  title: "Muskingum Flood Routing Calculator",
  description:
    "Bounded uniform-step linear Muskingum recursion with nonnegative coefficient guard and explicit opening outflow, no calibratedK/X inference or flood warning. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "muskingumRoutedOutflowsM3Second",
      label: "Muskingum routed outflows m3 second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedUniformStepInflowsM3Second:
        value.observedUniformStepInflowsM3Second as readonly number[],
      initialOutflowM3Second: value.initialOutflowM3Second as number,
      storageKSeconds: value.storageKSeconds as number,
      weightingX: value.weightingX as number,
      timeStepSeconds: value.timeStepSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
