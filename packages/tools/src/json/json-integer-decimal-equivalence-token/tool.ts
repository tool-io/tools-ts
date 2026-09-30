import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly validNumberToken: boolean;
  readonly integerValue: boolean;
  readonly canonical: string;
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
    validNumberToken: { type: "boolean" },
    integerValue: { type: "boolean" },
    canonical: { type: "string", maxLength: 8192 },
  },
  required: ["validNumberToken", "integerValue", "canonical"],
} as const;
/** Classify a strict JSON number token after binary64 conversion; lexical precision beyond binary64 is not preserved. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const validNumberToken =
      /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?(?![\s\S])/.test(token);
    if (!validNumberToken)
      return { validNumberToken: false, integerValue: false, canonical: "" };
    const x = Number(token);
    H.domain(Number.isFinite(x));
    return {
      validNumberToken: true,
      integerValue: Number.isInteger(x),
      canonical: JSON.stringify(x),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "1.0" },
  output: { validNumberToken: true, integerValue: true, canonical: "1" },
} satisfies ToolExample<Input, Output>;
export const jsonIntegerDecimalEquivalenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "json/json-integer-decimal-equivalence-token",
    title: "JSON Integer Decimal Equivalence Token Tool",
    description:
      "Classify a strict JSON number token after binary64 conversion; lexical precision beyond binary64 is not preserved.",
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
        validNumberToken: { type: "boolean" },
        integerValue: { type: "boolean" },
        canonical: { type: "string", maxLength: 8192 },
      },
      required: ["validNumberToken", "integerValue", "canonical"],
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
          id: "validNumberToken",
          label: "Valid Number Token",
          valueType: { type: "boolean" },
        },
        {
          id: "integerValue",
          label: "Integer Value",
          valueType: { type: "boolean" },
        },
        { id: "canonical", label: "Canonical", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = jsonIntegerDecimalEquivalenceTokenTool.execute;
export default jsonIntegerDecimalEquivalenceTokenTool;
