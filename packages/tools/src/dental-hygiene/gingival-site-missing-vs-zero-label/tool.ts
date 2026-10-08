import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assessed: boolean;
  readonly recordedValue: number;
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessed: { type: "boolean" },
    recordedValue: { type: "number" },
  },
  required: ["assessed", "recordedValue"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Distinguish an unassessed gingival site from an observed numeric zero without interpreting a periodontal measure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assessed, recordedValue } = request;
  const compute = (): Output => {
    return {
      status: !assessed
        ? "missing"
        : recordedValue === 0
          ? "observed-zero"
          : "observed-nonzero",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { assessed: true, recordedValue: 0 },
  output: { status: "observed-zero" },
} satisfies ToolExample<Input, Output>;
export const gingivalSiteMissingVsZeroLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dental-hygiene", "dental hygiene", "health and medicine"],
      keywords: ["dental hygiene", "health and medicine"],
    },
    id: "dental-hygiene/gingival-site-missing-vs-zero-label",
    title: "Gingival Site Missing Vs Zero Label",
    description:
      "Distinguish an unassessed gingival site from an observed numeric zero without interpreting a periodontal measure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assessed: { type: "boolean" },
        recordedValue: { type: "number" },
      },
      required: ["assessed", "recordedValue"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "assessed",
          label: "Assessed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "recordedValue",
          label: "Recorded Value",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = gingivalSiteMissingVsZeroLabelTool.execute;
export default gingivalSiteMissingVsZeroLabelTool;
