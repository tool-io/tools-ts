import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly required: readonly string[];
  readonly supplied: readonly string[];
  readonly waived: readonly string[];
};
export type Output = {
  readonly missing: readonly string[];
  readonly missingCount: number;
  readonly complete: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    required: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    supplied: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    waived: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["required", "supplied", "waived"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missing: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    missingCount: { type: "integer" },
    complete: { type: "boolean" },
  },
  required: ["missing", "missingCount", "complete"],
} as const;
/** Compute missing required attachment identifiers after explicit waiver exclusions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { required, supplied, waived } = request;
  const compute = (): Output => {
    const present = new Set([...supplied, ...waived]),
      missing = [...new Set(required)].filter((x) => !present.has(x));
    return {
      missing,
      missingCount: missing.length,
      complete: missing.length === 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { required: ["A", "B", "C"], supplied: ["A"], waived: ["C"] },
  output: { missing: ["B"], missingCount: 1, complete: false },
} satisfies ToolExample<Input, Output>;
export const applicationMissingAttachmentCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-administration/application-missing-attachment-count",
    title: "Application Missing Attachment Count Tool",
    description:
      "Compute missing required attachment identifiers after explicit waiver exclusions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        required: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        supplied: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        waived: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["required", "supplied", "waived"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missing: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        missingCount: { type: "integer" },
        complete: { type: "boolean" },
      },
      required: ["missing", "missingCount", "complete"],
    },
    ports: {
      inputs: [
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "supplied",
          label: "Supplied",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "waived",
          label: "Waived",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missing",
          label: "Missing",
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "missingCount",
          label: "Missing Count",
          valueType: { type: "integer" },
        },
        { id: "complete", label: "Complete", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = applicationMissingAttachmentCountTool.execute;
export default applicationMissingAttachmentCountTool;
