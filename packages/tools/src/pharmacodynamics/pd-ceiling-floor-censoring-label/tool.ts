import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recordId: string; readonly censoring: string };
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    censoring: {
      type: "string",
      maxLength: 8192,
      enum: ["none", "floor", "ceiling", "both", "unspecified"],
    },
  },
  required: ["recordId", "censoring"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded response censoring category without modifying a measured value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, censoring } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["none", "floor", "ceiling", "both", "unspecified"].includes(censoring),
      "censoring",
    );
    return { label: recordId + " [" + censoring + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "R17", censoring: "floor" },
  output: { label: "R17 [floor]" },
} satisfies ToolExample<Input, Output>;
export const pdCeilingFloorCensoringLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacodynamics", "pharmacy"],
      keywords: ["pharmacodynamics", "pharmacy"],
    },
    id: "pharmacodynamics/pd-ceiling-floor-censoring-label",
    title: "PD Ceiling Floor Censoring Label",
    description:
      "Label an explicitly recorded response censoring category without modifying a measured value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        censoring: {
          type: "string",
          maxLength: 8192,
          enum: ["none", "floor", "ceiling", "both", "unspecified"],
        },
      },
      required: ["recordId", "censoring"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "censoring",
          label: "Censoring",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = pdCeilingFloorCensoringLabelTool.execute;
export default pdCeilingFloorCensoringLabelTool;
