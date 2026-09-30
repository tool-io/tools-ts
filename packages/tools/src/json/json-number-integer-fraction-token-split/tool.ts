import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly integer: string;
  readonly fraction: string;
  readonly exponent: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    integer: { type: "string", maxLength: 8192 },
    fraction: { type: "string", maxLength: 8192 },
    exponent: { type: "string", maxLength: 8192 },
  },
  required: ["integer", "fraction", "exponent"],
} as const;
/** Calculate json number integer fraction token split from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { token } = input;
  const compute = (): Output => {
    const r = /^(-?(?:0|[1-9]\d*))(?:\.(\d+))?([eE][+-]?\d+)?(?![\s\S])/.exec(
      token,
    );
    H.domain(r !== null);
    return { integer: r[1], fraction: r[2] ?? "", exponent: r[3] ?? "" };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { token: "-12.340e+2" },
  output: { integer: "-12", fraction: "340", exponent: "e+2" },
} satisfies ToolExample<Input, Output>;
export const jsonNumberIntegerFractionTokenSplitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "json/json-number-integer-fraction-token-split",
      title: "JSON Number Integer Fraction Token Split Tool",
      description:
        "Calculate json number integer fraction token split from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          integer: { type: "string", maxLength: 8192 },
          fraction: { type: "string", maxLength: 8192 },
          exponent: { type: "string", maxLength: 8192 },
        },
        required: ["integer", "fraction", "exponent"],
      },
      ports: {
        inputs: [
          {
            id: "token",
            label: "Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "integer", label: "Integer", valueType: { type: "string" } },
          { id: "fraction", label: "Fraction", valueType: { type: "string" } },
          { id: "exponent", label: "Exponent", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = jsonNumberIntegerFractionTokenSplitTool.execute;
export default jsonNumberIntegerFractionTokenSplitTool;
