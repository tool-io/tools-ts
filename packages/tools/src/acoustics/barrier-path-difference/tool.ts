import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BarrierPathDifferenceInput = Readonly<{
  readonly sourceToEdgeMeters: number;
  readonly edgeToReceiverMeters: number;
  readonly directMeters: number;
}>;
export type BarrierPathDifferenceOutput = Readonly<{
  readonly pathDifferenceMeters: number;
}>;

export const calculateBarrierPathDifference = (
  x: BarrierPathDifferenceInput,
): BarrierPathDifferenceOutput => {
  if (!Number.isFinite(x.sourceToEdgeMeters) || x.sourceToEdgeMeters <= 0)
    simpleError("sourceToEdgeMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.edgeToReceiverMeters) || x.edgeToReceiverMeters <= 0)
    simpleError("edgeToReceiverMeters", "Provide a finite positive number.");
  if (!Number.isFinite(x.directMeters) || x.directMeters <= 0)
    simpleError("directMeters", "Provide a finite positive number.");
  if (!(x.sourceToEdgeMeters + x.edgeToReceiverMeters >= x.directMeters))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const pathDifferenceMeters =
    x.sourceToEdgeMeters + x.edgeToReceiverMeters - x.directMeters;
  if (!Number.isFinite(pathDifferenceMeters))
    simpleError(
      "pathDifferenceMeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    pathDifferenceMeters: Object.is(pathDifferenceMeters, -0)
      ? 0
      : pathDifferenceMeters,
  };
};

export const example = {
  input: {
    sourceToEdgeMeters: 3,
    edgeToReceiverMeters: 4,
    directMeters: 5,
  },
  output: { pathDifferenceMeters: 2 },
} satisfies ToolExample<
  BarrierPathDifferenceInput,
  BarrierPathDifferenceOutput
>;

export const tool = createSimpleTool({
  id: "acoustics/barrier-path-difference",
  title: "Barrier Path Difference",
  description:
    "Extra diffracted sound-path length around a barrier versus direct line-of-sight distance.",
  inputs: [
    {
      id: "sourceToEdgeMeters",
      kind: "number",
      label: "Source To Edge Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "edgeToReceiverMeters",
      kind: "number",
      label: "Edge To Receiver Meters",
      unit: "m",
      minimum: 0,
    },
    {
      id: "directMeters",
      kind: "number",
      label: "Direct Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "pathDifferenceMeters",
      kind: "number",
      label: "Path Difference Meters",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateBarrierPathDifference({
      sourceToEdgeMeters: input.sourceToEdgeMeters as number,
      edgeToReceiverMeters: input.edgeToReceiverMeters as number,
      directMeters: input.directMeters as number,
    }),
});
export const barrierPathDifferenceTool = tool;
export const runBarrierPathDifference = tool.execute;
export default tool;
