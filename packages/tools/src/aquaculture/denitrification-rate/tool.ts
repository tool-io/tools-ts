import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly reactorVolumeM3: number;
  readonly calibratedRemovalKgNPerM3Day: number;
  readonly availableCarbonKgCodPerDay: number;
  readonly carbonRequirementKgCodPerKgN: number;
  readonly nitrateLoadKgNPerDay: number;
}>;
export type Output = Readonly<{
  readonly kineticCapacityKgNPerDay: number;
  readonly carbonLimitedCapacityKgNPerDay: number;
  readonly predictedRemovalKgNPerDay: number;
  readonly unremovedLoadKgNPerDay: number;
}>;
const inputFields = [
  { id: "reactorVolumeM3", label: "Reactor volume m3", kind: "number" },
  {
    id: "calibratedRemovalKgNPerM3Day",
    label: "Calibrated removal kg n per m3 day",
    kind: "number",
  },
  {
    id: "availableCarbonKgCodPerDay",
    label: "Available carbon kg cod per day",
    kind: "number",
  },
  {
    id: "carbonRequirementKgCodPerKgN",
    label: "Carbon requirement kg cod per kg n",
    kind: "number",
  },
  {
    id: "nitrateLoadKgNPerDay",
    label: "Nitrate load kg n per day",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.reactorVolumeM3, "reactorVolumeM3");
  positive(input.carbonRequirementKgCodPerKgN, "carbonRequirementKgCodPerKgN");
  nonnegative(
    input.calibratedRemovalKgNPerM3Day,
    "calibratedRemovalKgNPerM3Day",
  );
  nonnegative(input.availableCarbonKgCodPerDay, "availableCarbonKgCodPerDay");
  nonnegative(input.nitrateLoadKgNPerDay, "nitrateLoadKgNPerDay");
  const kineticCapacityKgNPerDay =
      input.reactorVolumeM3 * input.calibratedRemovalKgNPerM3Day,
    carbonLimitedCapacityKgNPerDay =
      input.availableCarbonKgCodPerDay / input.carbonRequirementKgCodPerKgN,
    predictedRemovalKgNPerDay = Math.min(
      kineticCapacityKgNPerDay,
      carbonLimitedCapacityKgNPerDay,
      input.nitrateLoadKgNPerDay,
    );
  return {
    kineticCapacityKgNPerDay,
    carbonLimitedCapacityKgNPerDay,
    predictedRemovalKgNPerDay,
    unremovedLoadKgNPerDay:
      input.nitrateLoadKgNPerDay - predictedRemovalKgNPerDay,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  reactorVolumeM3: 10,
  calibratedRemovalKgNPerM3Day: 0.1,
  availableCarbonKgCodPerDay: 2,
  carbonRequirementKgCodPerKgN: 4,
  nitrateLoadKgNPerDay: 2,
} satisfies Input;
export const exampleOutput = {
  kineticCapacityKgNPerDay: 1,
  carbonLimitedCapacityKgNPerDay: 0.5,
  predictedRemovalKgNPerDay: 0.5,
  unremovedLoadKgNPerDay: 1.5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/denitrification-rate",
  title: "Denitrification Rate",
  description:
    "Screen denitrification capacity against kinetic volume, biodegradable carbon and nitrate load with caller rates; does not infer carbon bioavailability or recommend dosing.",
  inputs: inputFields,
  outputs: [
    {
      id: "kineticCapacityKgNPerDay",
      label: "Kinetic capacity kg n per day",
      kind: "number",
    },
    {
      id: "carbonLimitedCapacityKgNPerDay",
      label: "Carbon limited capacity kg n per day",
      kind: "number",
    },
    {
      id: "predictedRemovalKgNPerDay",
      label: "Predicted removal kg n per day",
      kind: "number",
    },
    {
      id: "unremovedLoadKgNPerDay",
      label: "Unremoved load kg n per day",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      reactorVolumeM3: value.reactorVolumeM3 as number,
      calibratedRemovalKgNPerM3Day:
        value.calibratedRemovalKgNPerM3Day as number,
      availableCarbonKgCodPerDay: value.availableCarbonKgCodPerDay as number,
      carbonRequirementKgCodPerKgN:
        value.carbonRequirementKgCodPerKgN as number,
      nitrateLoadKgNPerDay: value.nitrateLoadKgNPerDay as number,
    }),
});
export const run = tool.execute;
export default tool;
