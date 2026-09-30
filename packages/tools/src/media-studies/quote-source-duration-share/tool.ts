import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceDuration: number;
  readonly totalQuotedDuration: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceDuration: { type: "number", minimum: 0 },
    totalQuotedDuration: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceDuration", "totalQuotedDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate quote source duration share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceDuration, totalQuotedDuration } = request;
  const compute = (): Output => {
    H.positive(totalQuotedDuration);
    H.domain(sourceDuration >= 0 && sourceDuration <= totalQuotedDuration);
    return { share: sourceDuration / totalQuotedDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceDuration: 15, totalQuotedDuration: 60 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const quoteSourceDurationShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "media-studies/quote-source-duration-share",
    title: "Quote Source Duration Share Tool",
    description:
      "Calculate quote source duration share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceDuration: { type: "number", minimum: 0 },
        totalQuotedDuration: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sourceDuration", "totalQuotedDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "sourceDuration",
          label: "Source Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalQuotedDuration",
          label: "Total Quoted Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = quoteSourceDurationShareTool.execute;
export default quoteSourceDurationShareTool;
