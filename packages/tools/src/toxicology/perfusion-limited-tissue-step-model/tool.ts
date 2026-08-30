import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly arterialConcentration: number;
  readonly tissueVolumeLiters: number;
  readonly tissueBloodPartition: number;
  readonly tissueFlowLitersPerHour: number;
  readonly tissueClearanceLitersPerHour: number;
  readonly initialTissueConcentration: number;
  readonly timesHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly tissueConcentrations: readonly number[];
  readonly steadyStateTissueConcentration: number;
  readonly equilibrationRatePerHour: number;
}>;
const inputFields = [
  {
    id: "arterialConcentration",
    label: "Arterial concentration",
    kind: "number",
  },
  { id: "tissueVolumeLiters", label: "Tissue volume liters", kind: "number" },
  {
    id: "tissueBloodPartition",
    label: "Tissue blood partition",
    kind: "number",
  },
  {
    id: "tissueFlowLitersPerHour",
    label: "Tissue flow liters per hour",
    kind: "number",
  },
  {
    id: "tissueClearanceLitersPerHour",
    label: "Tissue clearance liters per hour",
    kind: "number",
  },
  {
    id: "initialTissueConcentration",
    label: "Initial tissue concentration",
    kind: "number",
  },
  { id: "timesHours", label: "Times hours", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.arterialConcentration, "arterialConcentration");
  positive(input.tissueVolumeLiters, "tissueVolumeLiters");
  positive(input.tissueBloodPartition, "tissueBloodPartition");
  positive(input.tissueFlowLitersPerHour, "tissueFlowLitersPerHour");
  nonnegative(
    input.tissueClearanceLitersPerHour,
    "tissueClearanceLitersPerHour",
  );
  nonnegative(input.initialTissueConcentration, "initialTissueConcentration");
  if (!input.timesHours.length)
    simpleError("timesHours", "Nonempty observation times required.");
  input.timesHours.forEach((v) => nonnegative(v, "timesHours"));
  const loss =
      input.tissueFlowLitersPerHour / input.tissueBloodPartition +
      input.tissueClearanceLitersPerHour,
    equilibrationRatePerHour = loss / input.tissueVolumeLiters,
    steadyStateTissueConcentration =
      (input.tissueFlowLitersPerHour * input.arterialConcentration) / loss;
  return {
    tissueConcentrations: input.timesHours.map(
      (t) =>
        steadyStateTissueConcentration +
        (input.initialTissueConcentration - steadyStateTissueConcentration) *
          Math.exp(-equilibrationRatePerHour * t),
    ),
    steadyStateTissueConcentration,
    equilibrationRatePerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  arterialConcentration: 10,
  tissueVolumeLiters: 2,
  tissueBloodPartition: 3,
  tissueFlowLitersPerHour: 1,
  tissueClearanceLitersPerHour: 0.5,
  initialTissueConcentration: 0,
  timesHours: [0, 1, 2],
} satisfies Input;
export const exampleOutput = {
  tissueConcentrations: [0, 4.089112437594675, 6.784821497915061],
  steadyStateTissueConcentration: 12,
  equilibrationRatePerHour: 0.4166666666666667,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "toxicology/perfusion-limited-tissue-step-model",
  title: "Simple PBPK Model",
  description:
    "Solve a single perfusion-limited tissue with constant arterial input and tissue-concentration-based clearance; a reduced PBPK component, not a complete physiology or human dose prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "tissueConcentrations",
      label: "Tissue concentrations",
      kind: "numberList",
    },
    {
      id: "steadyStateTissueConcentration",
      label: "Steady state tissue concentration",
      kind: "number",
    },
    {
      id: "equilibrationRatePerHour",
      label: "Equilibration rate per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      arterialConcentration: value.arterialConcentration as number,
      tissueVolumeLiters: value.tissueVolumeLiters as number,
      tissueBloodPartition: value.tissueBloodPartition as number,
      tissueFlowLitersPerHour: value.tissueFlowLitersPerHour as number,
      tissueClearanceLitersPerHour:
        value.tissueClearanceLitersPerHour as number,
      initialTissueConcentration: value.initialTissueConcentration as number,
      timesHours: value.timesHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
