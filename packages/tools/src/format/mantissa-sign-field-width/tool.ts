import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly negative: boolean;
  readonly zero: boolean;
  readonly policy: string;
};
export type Output = {
  readonly signColumns: number;
  readonly signToken: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    negative: { type: "boolean" },
    zero: { type: "boolean" },
    policy: {
      type: "string",
      maxLength: 8192,
      enum: ["auto", "always", "never", "except-zero"],
    },
  },
  required: ["negative", "zero", "policy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signColumns: { type: "integer" },
    signToken: { type: "string", maxLength: 8192 },
  },
  required: ["signColumns", "signToken"],
} as const;
/** Count only explicit mantissa sign occupancy under a supplied display policy, excluding digits and exponent width. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { negative, zero, policy } = request;
  const compute = (): Output => {
    H.domain(["auto", "always", "never", "except-zero"].includes(policy));
    return (() => {
      const token =
        policy === "never" || (policy === "except-zero" && zero)
          ? ""
          : negative
            ? "-"
            : policy === "always" || policy === "except-zero"
              ? "+"
              : "";
      return { signColumns: token.length, signToken: token };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { negative: false, zero: false, policy: "always" },
  output: { signColumns: 1, signToken: "+" },
} satisfies ToolExample<Input, Output>;
export const mantissaSignFieldWidthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "format/mantissa-sign-field-width",
    title: "Mantissa Sign Field Width Tool",
    description:
      "Count only explicit mantissa sign occupancy under a supplied display policy, excluding digits and exponent width.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        negative: { type: "boolean" },
        zero: { type: "boolean" },
        policy: {
          type: "string",
          maxLength: 8192,
          enum: ["auto", "always", "never", "except-zero"],
        },
      },
      required: ["negative", "zero", "policy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signColumns: { type: "integer" },
        signToken: { type: "string", maxLength: 8192 },
      },
      required: ["signColumns", "signToken"],
    },
    ports: {
      inputs: [
        {
          id: "negative",
          label: "Negative",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "zero",
          label: "Zero",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "policy",
          label: "Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "signColumns",
          label: "Sign Columns",
          valueType: { type: "integer" },
        },
        { id: "signToken", label: "Sign Token", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = mantissaSignFieldWidthTool.execute;
export default mantissaSignFieldWidthTool;
