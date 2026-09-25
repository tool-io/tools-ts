import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startSerial: number;
  readonly endSerial: number;
  readonly includeStart: boolean;
  readonly includeEnd: boolean;
};
export type Output = { readonly months: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startSerial: { type: "integer" },
    endSerial: { type: "integer" },
    includeStart: { type: "boolean" },
    includeEnd: { type: "boolean" },
  },
  required: ["startSerial", "endSerial", "includeStart", "includeEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { months: { type: "integer" } },
  required: ["months"],
} as const;
/** Calculate month span endpoint inclusion budget from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { startSerial, endSerial, includeStart, includeEnd } = input;
  const compute = (): Output => {
    H.domain(startSerial <= endSerial);
    return {
      months: Math.max(
        0,
        endSerial -
          startSerial -
          1 +
          (includeStart ? 1 : 0) +
          (includeEnd ? 1 : 0),
      ),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    startSerial: 12,
    endSerial: 15,
    includeStart: true,
    includeEnd: true,
  },
  output: { months: 4 },
} satisfies ToolExample<Input, Output>;
export const monthSpanEndpointInclusionBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "date/month-span-endpoint-inclusion-budget",
    title: "Month Span Endpoint Inclusion Budget Tool",
    description:
      "Calculate month span endpoint inclusion budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startSerial: { type: "integer" },
        endSerial: { type: "integer" },
        includeStart: { type: "boolean" },
        includeEnd: { type: "boolean" },
      },
      required: ["startSerial", "endSerial", "includeStart", "includeEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { months: { type: "integer" } },
      required: ["months"],
    },
    ports: {
      inputs: [
        {
          id: "startSerial",
          label: "Start Serial",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endSerial",
          label: "End Serial",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeStart",
          label: "Include Start",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "includeEnd",
          label: "Include End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "months", label: "Months", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = monthSpanEndpointInclusionBudgetTool.execute;
export default monthSpanEndpointInclusionBudgetTool;
