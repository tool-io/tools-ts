import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly first: number;
  readonly last: number;
  readonly total: number;
  readonly payloadLength: number;
};
export type Output = {
  readonly rangeLength: number;
  readonly consistent: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 0 },
    last: { type: "integer" },
    total: { type: "integer" },
    payloadLength: { type: "integer", minimum: 0 },
  },
  required: ["first", "last", "total", "payloadLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rangeLength: { type: "integer" },
    consistent: { type: "boolean" },
  },
  required: ["rangeLength", "consistent"],
} as const;
/** Calculate http content range length consistency from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { first, last, total, payloadLength } = input;
  const compute = (): Output => {
    H.integer(first, 0);
    H.integer(last, first);
    H.integer(total, last + 1);
    H.integer(payloadLength, 0);
    const rangeLength = last - first + 1;
    return { rangeLength, consistent: rangeLength === payloadLength };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { first: 10, last: 19, total: 100, payloadLength: 10 },
  output: { rangeLength: 10, consistent: true },
} satisfies ToolExample<Input, Output>;
export const httpContentRangeLengthConsistencyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "web/http-content-range-length-consistency",
    title: "HTTP Content Range Length Consistency Tool",
    description:
      "Calculate http content range length consistency from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer", minimum: 0 },
        last: { type: "integer" },
        total: { type: "integer" },
        payloadLength: { type: "integer", minimum: 0 },
      },
      required: ["first", "last", "total", "payloadLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rangeLength: { type: "integer" },
        consistent: { type: "boolean" },
      },
      required: ["rangeLength", "consistent"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "last",
          label: "Last",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "total",
          label: "Total",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "payloadLength",
          label: "Payload Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "rangeLength",
          label: "Range Length",
          valueType: { type: "integer" },
        },
        {
          id: "consistent",
          label: "Consistent",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = httpContentRangeLengthConsistencyTool.execute;
export default httpContentRangeLengthConsistencyTool;
