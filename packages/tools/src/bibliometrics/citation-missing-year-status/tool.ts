import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceId: string;
  readonly yearStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceId: { type: "string", maxLength: 8192, minLength: 1 },
    yearStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["known", "missing", "not-applicable", "uncertain"],
    },
  },
  required: ["referenceId", "yearStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a supplied citation-year availability status without inferring publication dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceId, yearStatus } = request;
  const compute = (): Output => {
    H.domain(referenceId.length > 0, "referenceId");
    H.domain(
      ["known", "missing", "not-applicable", "uncertain"].includes(yearStatus),
      "yearStatus",
    );
    return { label: referenceId + " [" + yearStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceId: "R17", yearStatus: "missing" },
  output: { label: "R17 [missing]" },
} satisfies ToolExample<Input, Output>;
export const citationMissingYearStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/citation-missing-year-status",
    title: "Citation Missing Year Status",
    description:
      "Label a supplied citation-year availability status without inferring publication dates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceId: { type: "string", maxLength: 8192, minLength: 1 },
        yearStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["known", "missing", "not-applicable", "uncertain"],
        },
      },
      required: ["referenceId", "yearStatus"],
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
          id: "referenceId",
          label: "Reference Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "yearStatus",
          label: "Year Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = citationMissingYearStatusTool.execute;
export default citationMissingYearStatusTool;
