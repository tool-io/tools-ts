import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly earliest: number; readonly latest: number };
export type Output = { readonly midpoint: number; readonly halfWidth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { earliest: { type: "number" }, latest: { type: "number" } },
  required: ["earliest", "latest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { midpoint: { type: "number" }, halfWidth: { type: "number" } },
  required: ["midpoint", "halfWidth"],
} as const;
/** Summarize supplied numeric date coordinates without resolving eras or asserting an attribution date. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliest, latest } = request;
  const compute = (): Output => {
    H.domain(earliest <= latest);
    return {
      midpoint: earliest / 2 + latest / 2,
      halfWidth: (latest - earliest) / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliest: 1600, latest: 1620 },
  output: { midpoint: 1610, halfWidth: 10 },
} satisfies ToolExample<Input, Output>;
export const artworkDateRangeMidpointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "art-history/artwork-date-range-midpoint",
    title: "Artwork Date Range Midpoint Tool",
    description:
      "Summarize supplied numeric date coordinates without resolving eras or asserting an attribution date.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { earliest: { type: "number" }, latest: { type: "number" } },
      required: ["earliest", "latest"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        midpoint: { type: "number" },
        halfWidth: { type: "number" },
      },
      required: ["midpoint", "halfWidth"],
    },
    ports: {
      inputs: [
        {
          id: "earliest",
          label: "Earliest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "latest",
          label: "Latest",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
        { id: "halfWidth", label: "Half Width", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = artworkDateRangeMidpointTool.execute;
export default artworkDateRangeMidpointTool;
