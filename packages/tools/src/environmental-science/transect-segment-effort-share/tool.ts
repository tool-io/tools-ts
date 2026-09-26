import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly segmentEffort: number;
  readonly totalEffort: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    segmentEffort: { type: "number", minimum: 0 },
    totalEffort: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["segmentEffort", "totalEffort"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate transect segment effort share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { segmentEffort, totalEffort } = request;
  const compute = (): Output => {
    H.positive(totalEffort);
    H.domain(segmentEffort >= 0 && segmentEffort <= totalEffort);
    return { share: segmentEffort / totalEffort };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { segmentEffort: 3, totalEffort: 12 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const transectSegmentEffortShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/transect-segment-effort-share",
    title: "Transect Segment Effort Share Tool",
    description:
      "Calculate transect segment effort share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        segmentEffort: { type: "number", minimum: 0 },
        totalEffort: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["segmentEffort", "totalEffort"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "segmentEffort",
          label: "Segment Effort",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalEffort",
          label: "Total Effort",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = transectSegmentEffortShareTool.execute;
export default transectSegmentEffortShareTool;
