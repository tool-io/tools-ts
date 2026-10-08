import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly drawingId: string;
  readonly usedRevision: string;
  readonly currentRecordedRevision: string;
};
export type Output = {
  readonly supersededByRecord: boolean;
  readonly label: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    drawingId: { type: "string", maxLength: 8192, minLength: 1 },
    usedRevision: { type: "string", maxLength: 8192, minLength: 1 },
    currentRecordedRevision: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["drawingId", "usedRevision", "currentRecordedRevision"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supersededByRecord: { type: "boolean" },
    label: { type: "string", maxLength: 8192 },
  },
  required: ["supersededByRecord", "label"],
} as const;
/** Compare a used drawing revision with an explicitly recorded current revision without inferring revision ordering or engineering approval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { drawingId, usedRevision, currentRecordedRevision } = request;
  const compute = (): Output => {
    H.domain(
      drawingId.length > 0 &&
        usedRevision.length > 0 &&
        currentRecordedRevision.length > 0,
      "drawingId",
    );
    return {
      supersededByRecord: usedRevision !== currentRecordedRevision,
      label:
        drawingId +
        "; used=" +
        usedRevision +
        "; current recorded=" +
        currentRecordedRevision,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { drawingId: "D17", usedRevision: "A", currentRecordedRevision: "B" },
  output: {
    supersededByRecord: true,
    label: "D17; used=A; current recorded=B",
  },
} satisfies ToolExample<Input, Output>;
export const drawingRevisionSupersededFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "construction-management",
        "construction management",
        "engineering",
      ],
      keywords: ["construction management", "engineering"],
    },
    id: "construction-management/drawing-revision-superseded-flag",
    title: "Drawing Revision Superseded Flag",
    description:
      "Compare a used drawing revision with an explicitly recorded current revision without inferring revision ordering or engineering approval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        drawingId: { type: "string", maxLength: 8192, minLength: 1 },
        usedRevision: { type: "string", maxLength: 8192, minLength: 1 },
        currentRecordedRevision: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["drawingId", "usedRevision", "currentRecordedRevision"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supersededByRecord: { type: "boolean" },
        label: { type: "string", maxLength: 8192 },
      },
      required: ["supersededByRecord", "label"],
    },
    ports: {
      inputs: [
        {
          id: "drawingId",
          label: "Drawing Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "usedRevision",
          label: "Used Revision",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentRecordedRevision",
          label: "Current Recorded Revision",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "supersededByRecord",
          label: "Superseded By Record",
          valueType: { type: "boolean" },
        },
        { id: "label", label: "Label", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = drawingRevisionSupersededFlagTool.execute;
export default drawingRevisionSupersededFlagTool;
