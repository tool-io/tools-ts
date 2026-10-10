import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly accessId: string; readonly side: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accessId: { type: "string", maxLength: 8192, minLength: 1 },
    side: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "midline", "unspecified"],
    },
  },
  required: ["accessId", "side"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Record explicit dialysis-access laterality without assessing location, function, or suitability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accessId, side } = request;
  const compute = (): Output => {
    H.domain(accessId.length > 0, "accessId");
    H.domain(
      ["left", "right", "midline", "unspecified"].includes(side),
      "side",
    );
    return { label: accessId + " [" + side + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { accessId: "A17", side: "left" },
  output: { label: "A17 [left]" },
} satisfies ToolExample<Input, Output>;
export const dialysisAccessRecordSideTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nephrology", "health and medicine"],
      keywords: ["nephrology", "health and medicine"],
    },
    id: "nephrology/dialysis-access-record-side",
    title: "Dialysis Access Record Side",
    description:
      "Record explicit dialysis-access laterality without assessing location, function, or suitability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accessId: { type: "string", maxLength: 8192, minLength: 1 },
        side: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "midline", "unspecified"],
        },
      },
      required: ["accessId", "side"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "accessId",
          label: "Access Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "side",
          label: "Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = dialysisAccessRecordSideTool.execute;
export default dialysisAccessRecordSideTool;
