import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalVolume: number;
  readonly splitVolumes: readonly number[];
  readonly retainedMask: readonly boolean[];
};
export type Output = {
  readonly retainedVolume: number;
  readonly share: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalVolume: { type: "number", exclusiveMinimum: 0 },
    splitVolumes: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    retainedMask: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["originalVolume", "splitVolumes", "retainedMask"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { retainedVolume: { type: "number" }, share: { type: "number" } },
  required: ["retainedVolume", "share"],
} as const;
/** Calculate sample split retention share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalVolume, splitVolumes, retainedMask } = request;
  const compute = (): Output => {
    H.positive(originalVolume);
    H.sameLength(splitVolumes, retainedMask);
    H.domain(
      splitVolumes.every((x) => x >= 0) &&
        splitVolumes.reduce((a, b) => a + b, 0) <= originalVolume,
    );
    return {
      retainedVolume: splitVolumes.reduce(
        (a, b, i) => a + (retainedMask[i] ? b : 0),
        0,
      ),
      share:
        splitVolumes.reduce((a, b, i) => a + (retainedMask[i] ? b : 0), 0) /
        originalVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    originalVolume: 10,
    splitVolumes: [3, 4, 2],
    retainedMask: [true, false, true],
  },
  output: { retainedVolume: 5, share: 0.5 },
} satisfies ToolExample<Input, Output>;
export const sampleSplitRetentionShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biotechnology/sample-split-retention-share",
    title: "Sample Split Retention Share Tool",
    description:
      "Calculate sample split retention share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalVolume: { type: "number", exclusiveMinimum: 0 },
        splitVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        retainedMask: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["originalVolume", "splitVolumes", "retainedMask"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedVolume: { type: "number" },
        share: { type: "number" },
      },
      required: ["retainedVolume", "share"],
    },
    ports: {
      inputs: [
        {
          id: "originalVolume",
          label: "Original Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "splitVolumes",
          label: "Split Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "retainedMask",
          label: "Retained Mask",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "retainedVolume",
          label: "Retained Volume",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = sampleSplitRetentionShareTool.execute;
export default sampleSplitRetentionShareTool;
