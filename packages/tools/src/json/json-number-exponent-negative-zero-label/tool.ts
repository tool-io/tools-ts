import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly exponentPresent: boolean;
  readonly exponentNegative: boolean;
  readonly exponentZero: boolean;
  readonly negativeExponentZero: boolean;
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
    exponentPresent: { type: "boolean" },
    exponentNegative: { type: "boolean" },
    exponentZero: { type: "boolean" },
    negativeExponentZero: { type: "boolean" },
  },
  required: [
    "exponentPresent",
    "exponentNegative",
    "exponentZero",
    "negativeExponentZero",
  ],
} as const;
/** Inspect the exponent lexeme’s own zero/sign spelling in strict JSON numeric text without relying on JSON.parse to preserve it. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const m = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE]([+-]?)(\d+))?(?![\s\S])/.exec(
      token,
    );
    H.domain(m !== null, "token");
    const exponentPresent = m[2] !== undefined,
      exponentNegative = exponentPresent && m[1] === "-",
      exponentZero = exponentPresent && /^0+(?![\s\S])/.test(m[2]);
    return {
      exponentPresent,
      exponentNegative,
      exponentZero,
      negativeExponentZero: exponentNegative && exponentZero,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "1.2e-00" },
  output: {
    exponentPresent: true,
    exponentNegative: true,
    exponentZero: true,
    negativeExponentZero: true,
  },
} satisfies ToolExample<Input, Output>;
export const jsonNumberExponentNegativeZeroLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "json/json-number-exponent-negative-zero-label",
      title: "JSON Number Exponent Negative Zero Label Tool",
      description:
        "Inspect the exponent lexeme’s own zero/sign spelling in strict JSON numeric text without relying on JSON.parse to preserve it.",
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
          exponentPresent: { type: "boolean" },
          exponentNegative: { type: "boolean" },
          exponentZero: { type: "boolean" },
          negativeExponentZero: { type: "boolean" },
        },
        required: [
          "exponentPresent",
          "exponentNegative",
          "exponentZero",
          "negativeExponentZero",
        ],
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
          {
            id: "exponentPresent",
            label: "Exponent Present",
            valueType: { type: "boolean" },
          },
          {
            id: "exponentNegative",
            label: "Exponent Negative",
            valueType: { type: "boolean" },
          },
          {
            id: "exponentZero",
            label: "Exponent Zero",
            valueType: { type: "boolean" },
          },
          {
            id: "negativeExponentZero",
            label: "Negative Exponent Zero",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = jsonNumberExponentNegativeZeroLabelTool.execute;
export default jsonNumberExponentNegativeZeroLabelTool;
