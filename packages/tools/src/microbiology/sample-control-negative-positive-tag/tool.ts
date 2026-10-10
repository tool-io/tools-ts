import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sampleId: string; readonly role: string };
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleId: { type: "string", maxLength: 8192, minLength: 1 },
    role: {
      type: "string",
      maxLength: 8192,
      enum: [
        "sample",
        "negative-control",
        "positive-control",
        "blank",
        "other",
      ],
    },
  },
  required: ["sampleId", "role"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label an explicitly assigned sample/control role without verifying a control outcome. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleId, role } = request;
  const compute = (): Output => {
    H.domain(sampleId.length > 0, "sampleId");
    H.domain(
      [
        "sample",
        "negative-control",
        "positive-control",
        "blank",
        "other",
      ].includes(role),
      "role",
    );
    return { tag: sampleId + " [" + role + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleId: "S17", role: "negative-control" },
  output: { tag: "S17 [negative-control]" },
} satisfies ToolExample<Input, Output>;
export const sampleControlNegativePositiveTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["microbiology", "biology"],
      keywords: ["microbiology", "biology"],
    },
    id: "microbiology/sample-control-negative-positive-tag",
    title: "Sample Control Negative Positive Tag",
    description:
      "Label an explicitly assigned sample/control role without verifying a control outcome.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleId: { type: "string", maxLength: 8192, minLength: 1 },
        role: {
          type: "string",
          maxLength: 8192,
          enum: [
            "sample",
            "negative-control",
            "positive-control",
            "blank",
            "other",
          ],
        },
      },
      required: ["sampleId", "role"],
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
          id: "sampleId",
          label: "Sample Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "role",
          label: "Role",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sampleControlNegativePositiveTagTool.execute;
export default sampleControlNegativePositiveTagTool;
