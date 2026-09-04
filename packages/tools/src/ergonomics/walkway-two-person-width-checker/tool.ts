import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly firstPersonOccupiedWidthCm: number;
  readonly secondPersonOccupiedWidthCm: number;
  readonly callerBetweenClearanceCm: number;
  readonly callerWallClearanceCm: number;
  readonly observedWalkwayWidthCm: number;
}>;
export type Output = Readonly<{
  readonly requiredPassingWidthCm: number;
  readonly signedPassingReserveCm: number;
}>;
const inputFields = [
  {
    id: "firstPersonOccupiedWidthCm",
    label: "First person occupied width cm",
    kind: "number",
  },
  {
    id: "secondPersonOccupiedWidthCm",
    label: "Second person occupied width cm",
    kind: "number",
  },
  {
    id: "callerBetweenClearanceCm",
    label: "Caller between clearance cm",
    kind: "number",
  },
  {
    id: "callerWallClearanceCm",
    label: "Caller wall clearance cm",
    kind: "number",
  },
  {
    id: "observedWalkwayWidthCm",
    label: "Observed walkway width cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.firstPersonOccupiedWidthCm, "firstPersonOccupiedWidthCm");
  positive(input.secondPersonOccupiedWidthCm, "secondPersonOccupiedWidthCm");
  positive(input.observedWalkwayWidthCm, "observedWalkwayWidthCm");
  nonnegative(input.callerBetweenClearanceCm, "callerBetweenClearanceCm");
  nonnegative(input.callerWallClearanceCm, "callerWallClearanceCm");
  const w =
    input.firstPersonOccupiedWidthCm +
    input.secondPersonOccupiedWidthCm +
    input.callerBetweenClearanceCm +
    2 * input.callerWallClearanceCm;
  return {
    requiredPassingWidthCm: w,
    signedPassingReserveCm: input.observedWalkwayWidthCm - w,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  firstPersonOccupiedWidthCm: 45,
  secondPersonOccupiedWidthCm: 50,
  callerBetweenClearanceCm: 10,
  callerWallClearanceCm: 5,
  observedWalkwayWidthCm: 120,
} satisfies Input;
export const exampleOutput = {
  requiredPassingWidthCm: 115,
  signedPassingReserveCm: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/walkway-two-person-width-checker",
  title: "Anthropometric Walkway Width Two-Person Passing Checker",
  description:
    "Two actual occupied body widths plus shared passing gap and two wall gaps, unlike single-person doorway or egress standard. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredPassingWidthCm",
      label: "Required passing width cm",
      kind: "number",
    },
    {
      id: "signedPassingReserveCm",
      label: "Signed passing reserve cm",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      firstPersonOccupiedWidthCm: value.firstPersonOccupiedWidthCm as number,
      secondPersonOccupiedWidthCm: value.secondPersonOccupiedWidthCm as number,
      callerBetweenClearanceCm: value.callerBetweenClearanceCm as number,
      callerWallClearanceCm: value.callerWallClearanceCm as number,
      observedWalkwayWidthCm: value.observedWalkwayWidthCm as number,
    }),
});
export const run = tool.execute;
export default tool;
