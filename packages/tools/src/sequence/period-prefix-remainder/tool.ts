import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prefixLength: number;
  readonly periodLength: number;
};
export type Output = {
  readonly fullPeriods: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixLength: { type: "integer", minimum: 0 },
    periodLength: { type: "integer", minimum: 1 },
  },
  required: ["prefixLength", "periodLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullPeriods: { type: "integer" },
    remainder: { type: "integer" },
  },
  required: ["fullPeriods", "remainder"],
} as const;
/** Calculate period prefix remainder from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prefixLength, periodLength } = request;
  const compute = (): Output => {
    H.integer(prefixLength, 0);
    H.integer(periodLength, 1);
    return {
      fullPeriods: Math.floor(prefixLength / periodLength),
      remainder: prefixLength % periodLength,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prefixLength: 17, periodLength: 5 },
  output: { fullPeriods: 3, remainder: 2 },
} satisfies ToolExample<Input, Output>;
export const periodPrefixRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/period-prefix-remainder",
    title: "Period Prefix Remainder Tool",
    description:
      "Calculate period prefix remainder from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prefixLength: { type: "integer", minimum: 0 },
        periodLength: { type: "integer", minimum: 1 },
      },
      required: ["prefixLength", "periodLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullPeriods: { type: "integer" },
        remainder: { type: "integer" },
      },
      required: ["fullPeriods", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "prefixLength",
          label: "Prefix Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "periodLength",
          label: "Period Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "fullPeriods",
          label: "Full Periods",
          valueType: { type: "integer" },
        },
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = periodPrefixRemainderTool.execute;
export default periodPrefixRemainderTool;
