import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly deskUndersideHeightCm: number;
  readonly loadedSeatHeightCm: number;
  readonly measuredThighThicknessCm: number;
  readonly callerMotionClearanceCm: number;
}>;
export type Output = Readonly<{
  readonly availableSeatToDeskClearanceCm: number;
  readonly signedThighClearanceMarginCm: number;
  readonly meetsCallerMotionClearance: boolean;
}>;
const inputFields = [
  {
    id: "deskUndersideHeightCm",
    label: "Desk underside height cm",
    kind: "number",
  },
  { id: "loadedSeatHeightCm", label: "Loaded seat height cm", kind: "number" },
  {
    id: "measuredThighThicknessCm",
    label: "Measured thigh thickness cm",
    kind: "number",
  },
  {
    id: "callerMotionClearanceCm",
    label: "Caller motion clearance cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.deskUndersideHeightCm, "deskUndersideHeightCm");
  nonnegative(input.loadedSeatHeightCm, "loadedSeatHeightCm");
  nonnegative(input.measuredThighThicknessCm, "measuredThighThicknessCm");
  nonnegative(input.callerMotionClearanceCm, "callerMotionClearanceCm");
  const available = input.deskUndersideHeightCm - input.loadedSeatHeightCm,
    margin =
      available -
      input.measuredThighThicknessCm -
      input.callerMotionClearanceCm;
  return {
    availableSeatToDeskClearanceCm: available,
    signedThighClearanceMarginCm: margin,
    meetsCallerMotionClearance: margin >= 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  deskUndersideHeightCm: 65,
  loadedSeatHeightCm: 45,
  measuredThighThicknessCm: 18,
  callerMotionClearanceCm: 3,
} satisfies Input;
export const exampleOutput = {
  availableSeatToDeskClearanceCm: 20,
  signedThighClearanceMarginCm: -1,
  meetsCallerMotionClearance: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/thigh-clearance-desk-checker",
  title: "Anthropometric Thigh Clearance Desk Underside Checker",
  description:
    "Reconcile actual loaded seat, desk underside, thigh thickness and additional caller movement clearance; no estimated stature conversion or recommended furniture setting.",
  inputs: inputFields,
  outputs: [
    {
      id: "availableSeatToDeskClearanceCm",
      label: "Available seat to desk clearance cm",
      kind: "number",
    },
    {
      id: "signedThighClearanceMarginCm",
      label: "Signed thigh clearance margin cm",
      kind: "number",
    },
    {
      id: "meetsCallerMotionClearance",
      label: "Meets caller motion clearance",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      deskUndersideHeightCm: value.deskUndersideHeightCm as number,
      loadedSeatHeightCm: value.loadedSeatHeightCm as number,
      measuredThighThicknessCm: value.measuredThighThicknessCm as number,
      callerMotionClearanceCm: value.callerMotionClearanceCm as number,
    }),
});
export const run = tool.execute;
export default tool;
