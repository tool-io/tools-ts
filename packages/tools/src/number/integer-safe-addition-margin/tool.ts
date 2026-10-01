import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly integer: number };
export type Output = {
  readonly positiveMargin: string;
  readonly negativeMargin: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { integer: { type: "integer" } },
  required: ["integer"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveMargin: { type: "string", maxLength: 8192 },
    negativeMargin: { type: "string", maxLength: 8192 },
  },
  required: ["positiveMargin", "negativeMargin"],
} as const;
/** Report exact decimal-string positive and negative addition margins around a safe integer, including margins larger than the safe-integer range. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { integer } = input;
  const compute = (): Output => {
    return {
      positiveMargin: String(9007199254740991n - BigInt(integer)),
      negativeMargin: String(BigInt(integer) + 9007199254740991n),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { integer: 42 },
  output: {
    positiveMargin: "9007199254740949",
    negativeMargin: "9007199254741033",
  },
} satisfies ToolExample<Input, Output>;
export const integerSafeAdditionMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-safe-addition-margin",
    title: "Integer Safe Addition Margin Tool",
    description:
      "Report exact decimal-string positive and negative addition margins around a safe integer, including margins larger than the safe-integer range.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { integer: { type: "integer" } },
      required: ["integer"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        positiveMargin: { type: "string", maxLength: 8192 },
        negativeMargin: { type: "string", maxLength: 8192 },
      },
      required: ["positiveMargin", "negativeMargin"],
    },
    ports: {
      inputs: [
        {
          id: "integer",
          label: "Integer",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "positiveMargin",
          label: "Positive Margin",
          valueType: { type: "string" },
        },
        {
          id: "negativeMargin",
          label: "Negative Margin",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = integerSafeAdditionMarginTool.execute;
export default integerSafeAdditionMarginTool;
