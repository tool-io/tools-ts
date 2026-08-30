import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fallTravelMeters: number;
  readonly performerReachMeters: number;
  readonly clearFloorLengthMeters: number;
  readonly requiredBufferMeters: number;
}>;
export type Output = Readonly<{
  readonly requiredClearanceMeters: number;
  readonly clearanceMarginMeters: number;
  readonly adequate: boolean;
}>;

export const calculate = (input: Input): Output => {
  const requiredClearanceMeters =
    input.fallTravelMeters +
    input.performerReachMeters +
    input.requiredBufferMeters;
  return {
    requiredClearanceMeters,
    clearanceMarginMeters:
      input.clearFloorLengthMeters - requiredClearanceMeters,
    adequate: input.clearFloorLengthMeters >= requiredClearanceMeters,
  };
};

export const exampleInput = {
  fallTravelMeters: 2,
  performerReachMeters: 1,
  clearFloorLengthMeters: 4,
  requiredBufferMeters: 0.5,
} satisfies Input;
export const exampleOutput = {
  requiredClearanceMeters: 3.5,
  clearanceMarginMeters: 0.5,
  adequate: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      fallTravelMeters: input.fallTravelMeters as number,
      performerReachMeters: input.performerReachMeters as number,
      clearFloorLengthMeters: input.clearFloorLengthMeters as number,
      requiredBufferMeters: input.requiredBufferMeters as number,
    }),
  description:
    "Check breakfall floor clearance against travel, reach, and buffer.",
  id: "theatre/breakfall-clearance",
  inputs: [
    {
      id: "fallTravelMeters",
      label: "Planned fall travel",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "performerReachMeters",
      label: "Performer reach allowance",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "clearFloorLengthMeters",
      label: "Clear floor length",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "requiredBufferMeters",
      label: "Required buffer",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "requiredClearanceMeters",
      label: "Required clearance",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "clearanceMarginMeters",
      label: "Clearance margin",
      kind: "number",
      unit: "m",
    },
    { id: "adequate", label: "Clearance is adequate", kind: "boolean" },
  ],
  title: "Breakfall Clearance",
});

export const run = tool.execute;
export default tool;
