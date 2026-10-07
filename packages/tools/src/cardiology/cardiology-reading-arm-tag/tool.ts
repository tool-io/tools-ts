import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly readingId: string; readonly arm: string };
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    readingId: { type: "string", maxLength: 8192, minLength: 1 },
    arm: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "unspecified"],
    },
  },
  required: ["readingId", "arm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Attach explicitly recorded arm laterality to a measurement without selecting a measurement arm. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { readingId, arm } = request;
  const compute = (): Output => {
    H.domain(readingId.length > 0, "readingId");
    H.domain(["left", "right", "unspecified"].includes(arm), "arm");
    return { tag: readingId + " [" + arm + " arm]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { readingId: "BP17", arm: "left" },
  output: { tag: "BP17 [left arm]" },
} satisfies ToolExample<Input, Output>;
export const cardiologyReadingArmTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["cardiology", "health and medicine"],
      keywords: ["cardiology", "health and medicine"],
    },
    id: "cardiology/cardiology-reading-arm-tag",
    title: "Cardiology Reading Arm Tag",
    description:
      "Attach explicitly recorded arm laterality to a measurement without selecting a measurement arm.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        readingId: { type: "string", maxLength: 8192, minLength: 1 },
        arm: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "unspecified"],
        },
      },
      required: ["readingId", "arm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "readingId",
          label: "Reading Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "arm",
          label: "Arm",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = cardiologyReadingArmTagTool.execute;
export default cardiologyReadingArmTagTool;
