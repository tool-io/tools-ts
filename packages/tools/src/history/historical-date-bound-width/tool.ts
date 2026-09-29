import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earliestIndex: number;
  readonly latestIndex: number;
  readonly includeEndpoints: boolean;
};
export type Output = { readonly width: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earliestIndex: { type: "integer" },
    latestIndex: { type: "integer" },
    includeEndpoints: { type: "boolean" },
  },
  required: ["earliestIndex", "latestIndex", "includeEndpoints"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { width: { type: "integer" } },
  required: ["width"],
} as const;
/** Width of a supplied historical day/year index envelope in one explicit caller-defined calendar basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earliestIndex, latestIndex, includeEndpoints } = request;
  const compute = (): Output => {
    H.domain(earliestIndex <= latestIndex);
    return { width: latestIndex - earliestIndex + (includeEndpoints ? 1 : 0) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earliestIndex: 100, latestIndex: 130, includeEndpoints: true },
  output: { width: 31 },
} satisfies ToolExample<Input, Output>;
export const historicalDateBoundWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/historical-date-bound-width",
    title: "Historical Date Bound Width Tool",
    description:
      "Width of a supplied historical day/year index envelope in one explicit caller-defined calendar basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earliestIndex: { type: "integer" },
        latestIndex: { type: "integer" },
        includeEndpoints: { type: "boolean" },
      },
      required: ["earliestIndex", "latestIndex", "includeEndpoints"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { width: { type: "integer" } },
      required: ["width"],
    },
    ports: {
      inputs: [
        {
          id: "earliestIndex",
          label: "Earliest Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "latestIndex",
          label: "Latest Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeEndpoints",
          label: "Include Endpoints",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "width", label: "Width", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = historicalDateBoundWidthTool.execute;
export default historicalDateBoundWidthTool;
