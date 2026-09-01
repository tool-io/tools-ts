import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, peakStorage } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedIntervalHours: readonly number[];
  readonly observedInflowM3Hour: readonly number[];
  readonly callerOutflowM3Hour: readonly number[];
}>;
export type Output = Readonly<{
  readonly modeledPeakDetentionM3: number;
  readonly modeledEndingDetentionM3: number;
  readonly unavailableOutletDemandM3: number;
}>;
const inputFields = [
  {
    id: "observedIntervalHours",
    label: "Observed interval hours",
    kind: "numberList",
  },
  {
    id: "observedInflowM3Hour",
    label: "Observed inflow m3 hour",
    kind: "numberList",
  },
  {
    id: "callerOutflowM3Hour",
    label: "Caller outflow m3 hour",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const result = peakStorage(
    input.observedIntervalHours,
    input.observedInflowM3Hour,
    input.callerOutflowM3Hour,
  );
  return {
    modeledPeakDetentionM3: result.peak,
    modeledEndingDetentionM3: result.end,
    unavailableOutletDemandM3: result.overflow,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIntervalHours: [1, 2, 1],
  observedInflowM3Hour: [10, 2, 0],
  callerOutflowM3Hour: [5, 5, 5],
} satisfies Input;
export const exampleOutput = {
  modeledPeakDetentionM3: 5,
  modeledEndingDetentionM3: 0,
  unavailableOutletDemandM3: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/detention-basin-volume",
  title: "Plumbing Detention Basin Volume Calculator",
  description:
    "Route actual piecewise constant detention inflow/outflow inventory with empty initial basin and no negative storage, exposing unavailable outlet demand; not peak flow×duration or routing design approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledPeakDetentionM3",
      label: "Modeled peak detention m3",
      kind: "number",
    },
    {
      id: "modeledEndingDetentionM3",
      label: "Modeled ending detention m3",
      kind: "number",
    },
    {
      id: "unavailableOutletDemandM3",
      label: "Unavailable outlet demand m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIntervalHours: value.observedIntervalHours as readonly number[],
      observedInflowM3Hour: value.observedInflowM3Hour as readonly number[],
      callerOutflowM3Hour: value.callerOutflowM3Hour as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
