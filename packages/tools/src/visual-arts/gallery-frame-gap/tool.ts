import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRightEdge: number;
  readonly nextLeftEdge: number;
};
export type Output = { readonly gap: number; readonly overlaps: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRightEdge: { type: "number" },
    nextLeftEdge: { type: "number" },
  },
  required: ["firstRightEdge", "nextLeftEdge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, overlaps: { type: "boolean" } },
  required: ["gap", "overlaps"],
} as const;
/** Measure signed horizontal separation between adjacent frame edges in a shared gallery coordinate system. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstRightEdge, nextLeftEdge } = request;
  const compute = (): Output => {
    return {
      gap: nextLeftEdge - firstRightEdge,
      overlaps: nextLeftEdge < firstRightEdge,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstRightEdge: 120, nextLeftEdge: 135 },
  output: { gap: 15, overlaps: false },
} satisfies ToolExample<Input, Output>;
export const galleryFrameGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "visual-arts/gallery-frame-gap",
    title: "Gallery Frame Gap Tool",
    description:
      "Measure signed horizontal separation between adjacent frame edges in a shared gallery coordinate system.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRightEdge: { type: "number" },
        nextLeftEdge: { type: "number" },
      },
      required: ["firstRightEdge", "nextLeftEdge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, overlaps: { type: "boolean" } },
      required: ["gap", "overlaps"],
    },
    ports: {
      inputs: [
        {
          id: "firstRightEdge",
          label: "First Right Edge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextLeftEdge",
          label: "Next Left Edge",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "overlaps", label: "Overlaps", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = galleryFrameGapTool.execute;
export default galleryFrameGapTool;
