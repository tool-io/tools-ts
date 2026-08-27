import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type RefractoryPeriodAbsoluteInput = {
  readonly absoluteRefractoryMs?: number;
  readonly elapsedMs: number;
};

export type RefractoryPeriodAbsoluteOutput = {
  readonly absoluteRefractoryMs: number;
  readonly isInRefractory: boolean;
};

export const refractoryPeriodAbsoluteExample = {
  input: { elapsedMs: 0.5 },
  output: { absoluteRefractoryMs: 1, isInRefractory: true },
} satisfies ToolExample<
  RefractoryPeriodAbsoluteInput,
  RefractoryPeriodAbsoluteOutput
>;

export const refractoryPeriodAbsoluteTool = createSimpleTool({
  id: "biology/refractory-period-absolute",
  title: "Absolute Refractory Check",
  description:
    "Check whether a neuron is inside its absolute refractory period by comparing elapsed time since the last spike against the absolute refractory window.",
  inputs: [
    {
      default: 1,
      description: "Absolute refractory duration; defaults to 1 ms.",
      id: "absoluteRefractoryMs",
      kind: "number",
      label: "Absolute refractory period",
      maximum: 10,
      minimum: 0.1,
      unit: "ms",
    },
    {
      id: "elapsedMs",
      kind: "number",
      label: "Elapsed time",
      minimum: 0,
      unit: "ms",
    },
  ],
  outputs: [
    {
      id: "isInRefractory",
      kind: "boolean",
      label: "Is in refractory period",
    },
    {
      id: "absoluteRefractoryMs",
      kind: "number",
      label: "Absolute refractory period",
      unit: "ms",
    },
  ],
  calculate: (input) => {
    const absoluteRefractoryMs = input.absoluteRefractoryMs as number;
    return {
      absoluteRefractoryMs,
      isInRefractory: (input.elapsedMs as number) < absoluteRefractoryMs,
    };
  },
});
export const runRefractoryPeriodAbsolute = refractoryPeriodAbsoluteTool.execute;
export default refractoryPeriodAbsoluteTool;
