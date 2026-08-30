import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly transmitterToTargetMeters: number;
  readonly targetToReceiverMeters: number;
}>;
export type Output = Readonly<{
  readonly monostaticPathMeters: number;
  readonly bistaticPathMeters: number;
  readonly pathDifferenceMeters: number;
  readonly bistaticDelaySeconds: number;
}>;

export const calculate = (input: Input): Output => {
  const monostaticPathMeters = 2 * input.transmitterToTargetMeters;
  const bistaticPathMeters =
    input.transmitterToTargetMeters + input.targetToReceiverMeters;
  return {
    monostaticPathMeters,
    bistaticPathMeters,
    pathDifferenceMeters: bistaticPathMeters - monostaticPathMeters,
    bistaticDelaySeconds: bistaticPathMeters / 299792458,
  };
};

export const exampleInput = {
  transmitterToTargetMeters: 100,
  targetToReceiverMeters: 120,
} satisfies Input;
export const exampleOutput = {
  monostaticPathMeters: 200,
  bistaticPathMeters: 220,
  pathDifferenceMeters: 20,
  bistaticDelaySeconds: 7.338410094359345e-7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      transmitterToTargetMeters: input.transmitterToTargetMeters as number,
      targetToReceiverMeters: input.targetToReceiverMeters as number,
    }),
  description: "Compare monostatic and bistatic lidar path lengths and delay.",
  id: "laser/lidar-geometry-comparison",
  inputs: [
    {
      id: "transmitterToTargetMeters",
      label: "Transmitter-to-target distance",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "targetToReceiverMeters",
      label: "Target-to-receiver distance",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
  ],
  outputs: [
    {
      id: "monostaticPathMeters",
      label: "Equivalent monostatic path",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "bistaticPathMeters",
      label: "Bistatic path",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "pathDifferenceMeters",
      label: "Bistatic minus monostatic path",
      kind: "number",
      unit: "m",
    },
    {
      id: "bistaticDelaySeconds",
      label: "Bistatic propagation delay",
      kind: "number",
      minimum: 0,
      unit: "s",
    },
  ],
  title: "Lidar Geometry Comparison",
});

export const run = tool.execute;
export default tool;
