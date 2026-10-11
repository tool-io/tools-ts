import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly recordedSide: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedSide: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "bilateral", "unspecified"],
    },
  },
  required: ["recordId", "recordedSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach explicit foot laterality to a podiatry record without identifying anatomy or a condition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, recordedSide } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(
      ["left", "right", "bilateral", "unspecified"].includes(recordedSide),
      "recordedSide",
    );
    return { label: recordId + " [" + recordedSide + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordId: "P17", recordedSide: "left" },
  output: { label: "P17 [left]" },
} satisfies ToolExample<Input, Output>;
export const podiatryRightLeftLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["podiatry", "health and medicine"],
      keywords: ["podiatry", "health and medicine"],
    },
    id: "podiatry/podiatry-right-left-label",
    title: "Podiatry Right Left Label",
    description:
      "Attach explicit foot laterality to a podiatry record without identifying anatomy or a condition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedSide: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "bilateral", "unspecified"],
        },
      },
      required: ["recordId", "recordedSide"],
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
          id: "recordedSide",
          label: "Recorded Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = podiatryRightLeftLabelTool.execute;
export default podiatryRightLeftLabelTool;
