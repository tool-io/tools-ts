import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parentVolume: number;
  readonly childVolumes: readonly number[];
};
export type Output = {
  readonly childTotal: number;
  readonly share: number;
  readonly retainedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parentVolume: { type: "number", exclusiveMinimum: 0 },
    childVolumes: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
  },
  required: ["parentVolume", "childVolumes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    childTotal: { type: "number" },
    share: { type: "number" },
    retainedVolume: { type: "number" },
  },
  required: ["childTotal", "share", "retainedVolume"],
} as const;
/** Calculate parent child volume share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parentVolume, childVolumes } = request;
  const compute = (): Output => {
    H.positive(parentVolume);
    H.domain(
      childVolumes.every((x) => x >= 0) &&
        childVolumes.reduce((a, b) => a + b, 0) <= parentVolume,
    );
    return {
      childTotal: childVolumes.reduce((a, b) => a + b, 0),
      share: childVolumes.reduce((a, b) => a + b, 0) / parentVolume,
      retainedVolume: parentVolume - childVolumes.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parentVolume: 10, childVolumes: [2, 3] },
  output: { childTotal: 5, share: 0.5, retainedVolume: 5 },
} satisfies ToolExample<Input, Output>;
export const parentChildVolumeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/parent-child-volume-share",
    title: "Parent Child Volume Share Tool",
    description:
      "Calculate parent child volume share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        parentVolume: { type: "number", exclusiveMinimum: 0 },
        childVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
      },
      required: ["parentVolume", "childVolumes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        childTotal: { type: "number" },
        share: { type: "number" },
        retainedVolume: { type: "number" },
      },
      required: ["childTotal", "share", "retainedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "parentVolume",
          label: "Parent Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "childVolumes",
          label: "Child Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "childTotal",
          label: "Child Total",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "retainedVolume",
          label: "Retained Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = parentChildVolumeShareTool.execute;
export default parentChildVolumeShareTool;
