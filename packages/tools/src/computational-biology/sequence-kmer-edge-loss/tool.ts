import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sequenceLength: number;
  readonly k: number;
  readonly clippedLeft: number;
  readonly clippedRight: number;
};
export type Output = {
  readonly originalWindows: number;
  readonly retainedWindows: number;
  readonly lostWindows: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sequenceLength: { type: "integer", minimum: 0 },
    k: { type: "integer", minimum: 1 },
    clippedLeft: { type: "integer", minimum: 0 },
    clippedRight: { type: "integer", minimum: 0 },
  },
  required: ["sequenceLength", "k", "clippedLeft", "clippedRight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalWindows: { type: "integer" },
    retainedWindows: { type: "integer" },
    lostWindows: { type: "integer" },
  },
  required: ["originalWindows", "retainedWindows", "lostWindows"],
} as const;
/** Calculate sequence kmer edge loss from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sequenceLength, k, clippedLeft, clippedRight } = request;
  const compute = (): Output => {
    H.integer(sequenceLength, 0);
    H.integer(k, 1);
    H.integer(clippedLeft, 0, sequenceLength);
    H.integer(clippedRight, 0, sequenceLength - clippedLeft);
    return {
      originalWindows: Math.max(0, sequenceLength - k + 1),
      retainedWindows: Math.max(
        0,
        sequenceLength - clippedLeft - clippedRight - k + 1,
      ),
      lostWindows:
        Math.max(0, sequenceLength - k + 1) -
        Math.max(0, sequenceLength - clippedLeft - clippedRight - k + 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sequenceLength: 10, k: 3, clippedLeft: 1, clippedRight: 2 },
  output: { originalWindows: 8, retainedWindows: 5, lostWindows: 3 },
} satisfies ToolExample<Input, Output>;
export const sequenceKmerEdgeLossTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/sequence-kmer-edge-loss",
    title: "Sequence Kmer Edge Loss Tool",
    description:
      "Calculate sequence kmer edge loss from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sequenceLength: { type: "integer", minimum: 0 },
        k: { type: "integer", minimum: 1 },
        clippedLeft: { type: "integer", minimum: 0 },
        clippedRight: { type: "integer", minimum: 0 },
      },
      required: ["sequenceLength", "k", "clippedLeft", "clippedRight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalWindows: { type: "integer" },
        retainedWindows: { type: "integer" },
        lostWindows: { type: "integer" },
      },
      required: ["originalWindows", "retainedWindows", "lostWindows"],
    },
    ports: {
      inputs: [
        {
          id: "sequenceLength",
          label: "Sequence Length",
          required: true,
          valueType: { type: "integer" },
        },
        { id: "k", label: "K", required: true, valueType: { type: "integer" } },
        {
          id: "clippedLeft",
          label: "Clipped Left",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "clippedRight",
          label: "Clipped Right",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "originalWindows",
          label: "Original Windows",
          valueType: { type: "integer" },
        },
        {
          id: "retainedWindows",
          label: "Retained Windows",
          valueType: { type: "integer" },
        },
        {
          id: "lostWindows",
          label: "Lost Windows",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = sequenceKmerEdgeLossTool.execute;
export default sequenceKmerEdgeLossTool;
