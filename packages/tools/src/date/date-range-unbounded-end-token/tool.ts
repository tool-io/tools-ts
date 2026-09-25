import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  dateOnly,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly start: string; readonly end: string };
export type Output = {
  readonly interval: string;
  readonly unboundedStart: boolean;
  readonly unboundedEnd: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    start: { type: "string", maxLength: 8192 },
    end: { type: "string", maxLength: 8192 },
  },
  required: ["start", "end"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interval: { type: "string", maxLength: 8192 },
    unboundedStart: { type: "boolean" },
    unboundedEnd: { type: "boolean" },
  },
  required: ["interval", "unboundedStart", "unboundedEnd"],
} as const;
/** Compute date range unbounded end token from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { start, end } = input;
  const compute = (): Output => {
    if (start !== "..") dateOnly(start);
    if (end !== "..") dateOnly(end);
    if (start !== ".." && end !== "..") domain(start <= end);
    return {
      interval: start + "/" + end,
      unboundedStart: start === "..",
      unboundedEnd: end === "..",
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { start: "..", end: "2024-01-01" },
  output: {
    interval: "../2024-01-01",
    unboundedStart: true,
    unboundedEnd: false,
  },
} satisfies ToolExample<Input, Output>;
export const dateRangeUnboundedEndTokenTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "date/date-range-unbounded-end-token",
  title: "Date Range Unbounded End Token Tool",
  description:
    "Compute date range unbounded end token from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "start",
        label: "Start",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "end",
        label: "End",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "interval", label: "Interval", valueType: { type: "string" } },
      {
        id: "unboundedStart",
        label: "Unbounded Start",
        valueType: { type: "boolean" },
      },
      {
        id: "unboundedEnd",
        label: "Unbounded End",
        valueType: { type: "boolean" },
      },
    ],
  },
});
export const run = dateRangeUnboundedEndTokenTool.execute;
export default dateRangeUnboundedEndTokenTool;
