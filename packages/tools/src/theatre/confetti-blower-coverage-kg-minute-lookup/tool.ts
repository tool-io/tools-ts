import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly measuredConfettiCollectedKg: number;
  readonly measuredCoveredFloorAreaM2: number;
  readonly plannedFloorAreaM2: number;
  readonly measuredBlowerRateKgMinute: number;
}>;
export type Output = Readonly<{
  readonly calibratedConfettiKgM2: number;
  readonly estimatedConfettiRequiredKg: number;
  readonly estimatedBlowerEnabledMinutes: number;
}>;
const inputFields = [
  {
    id: "measuredConfettiCollectedKg",
    label: "Measured confetti collected kg",
    kind: "number",
  },
  {
    id: "measuredCoveredFloorAreaM2",
    label: "Measured covered floor area m2",
    kind: "number",
  },
  { id: "plannedFloorAreaM2", label: "Planned floor area m2", kind: "number" },
  {
    id: "measuredBlowerRateKgMinute",
    label: "Measured blower rate kg minute",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.measuredCoveredFloorAreaM2, "measuredCoveredFloorAreaM2");
  positive(input.measuredBlowerRateKgMinute, "measuredBlowerRateKgMinute");
  nonnegative(input.measuredConfettiCollectedKg, "measuredConfettiCollectedKg");
  nonnegative(input.plannedFloorAreaM2, "plannedFloorAreaM2");
  const density =
      input.measuredConfettiCollectedKg / input.measuredCoveredFloorAreaM2,
    mass = density * input.plannedFloorAreaM2;
  return {
    calibratedConfettiKgM2: density,
    estimatedConfettiRequiredKg: mass,
    estimatedBlowerEnabledMinutes: mass / input.measuredBlowerRateKgMinute,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredConfettiCollectedKg: 0.2,
  measuredCoveredFloorAreaM2: 10,
  plannedFloorAreaM2: 30,
  measuredBlowerRateKgMinute: 0.1,
} satisfies Input;
export const exampleOutput = {
  calibratedConfettiKgM2: 0.02,
  estimatedConfettiRequiredKg: 0.6,
  estimatedBlowerEnabledMinutes: 6,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/confetti-blower-coverage-kg-minute-lookup",
  title: "Confetti Blower Coverage KG Minute Lookup",
  description:
    "Scale actual measured confetti floor deposition/flow to caller area; uniform matched conditions assumed, no trajectory/audience exclusion, cleanup, fire/respiratory or blower safety approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "calibratedConfettiKgM2",
      label: "Calibrated confetti kg m2",
      kind: "number",
    },
    {
      id: "estimatedConfettiRequiredKg",
      label: "Estimated confetti required kg",
      kind: "number",
    },
    {
      id: "estimatedBlowerEnabledMinutes",
      label: "Estimated blower enabled minutes",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredConfettiCollectedKg: value.measuredConfettiCollectedKg as number,
      measuredCoveredFloorAreaM2: value.measuredCoveredFloorAreaM2 as number,
      plannedFloorAreaM2: value.plannedFloorAreaM2 as number,
      measuredBlowerRateKgMinute: value.measuredBlowerRateKgMinute as number,
    }),
});
export const run = tool.execute;
export default tool;
