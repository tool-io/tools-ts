import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly digits: string };
export type Output = {
  readonly weightedSum: number;
  readonly remainder: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { digits: { type: "string", maxLength: 8192 } },
  required: ["digits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedSum: { type: "integer" },
    remainder: { type: "integer" },
  },
  required: ["weightedSum", "remainder"],
} as const;
/** Compute cas check digit remainder term from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { digits } = input;
  const compute = (): Output => {
    domain(/^\d{1,9}(?![\s\S])/.test(digits));
    const weightedSum = [...digits]
      .reverse()
      .reduce((s, d, i) => s + Number(d) * (i + 1), 0);
    return { weightedSum, remainder: weightedSum % 10 };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { digits: "773218" },
  output: { weightedSum: 105, remainder: 5 },
} satisfies ToolExample<Input, Output>;
export const casCheckDigitRemainderTermTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/cas-check-digit-remainder-term",
  title: "CAS Check Digit Remainder Term Tool",
  description:
    "Compute cas check digit remainder term from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "digits",
        label: "Digits",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      {
        id: "weightedSum",
        label: "Weighted Sum",
        valueType: { type: "integer" },
      },
      { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
    ],
  },
});
export const run = casCheckDigitRemainderTermTool.execute;
export default casCheckDigitRemainderTermTool;
