import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly variables: readonly string[];
  readonly exponents: readonly number[];
  readonly requestedVariable: string;
};
export type Output = {
  readonly absentFromSupport: boolean;
  readonly listed: boolean;
  readonly exponent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    variables: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    exponents: { type: "array", maxItems: 256, items: { type: "integer" } },
    requestedVariable: { type: "string", maxLength: 8192 },
  },
  required: ["variables", "exponents", "requestedVariable"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absentFromSupport: { type: "boolean" },
    listed: { type: "boolean" },
    exponent: { type: "integer" },
  },
  required: ["absentFromSupport", "listed", "exponent"],
} as const;
/** Inspect supplied exponents of a nonzero monomial; an unlisted or zero-exponent variable is absent from its support. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { variables, exponents, requestedVariable } = request;
  const compute = (): Output => {
    H.sameLength(variables, exponents);
    H.domain(
      new Set(variables).size === variables.length &&
        exponents.every((x) => x >= 0),
    );
    const i = variables.indexOf(requestedVariable),
      exponent = i < 0 ? 0 : exponents[i];
    return { absentFromSupport: exponent === 0, listed: i >= 0, exponent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { variables: ["x", "y"], exponents: [2, 0], requestedVariable: "y" },
  output: { absentFromSupport: true, listed: true, exponent: 0 },
} satisfies ToolExample<Input, Output>;
export const monomialAbsentVariableIndicatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/monomial-absent-variable-indicator",
    title: "Monomial Absent Variable Indicator Tool",
    description:
      "Inspect supplied exponents of a nonzero monomial; an unlisted or zero-exponent variable is absent from its support.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        variables: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        exponents: { type: "array", maxItems: 256, items: { type: "integer" } },
        requestedVariable: { type: "string", maxLength: 8192 },
      },
      required: ["variables", "exponents", "requestedVariable"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absentFromSupport: { type: "boolean" },
        listed: { type: "boolean" },
        exponent: { type: "integer" },
      },
      required: ["absentFromSupport", "listed", "exponent"],
    },
    ports: {
      inputs: [
        {
          id: "variables",
          label: "Variables",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "exponents",
          label: "Exponents",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "requestedVariable",
          label: "Requested Variable",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "absentFromSupport",
          label: "Absent From Support",
          valueType: { type: "boolean" },
        },
        { id: "listed", label: "Listed", valueType: { type: "boolean" } },
        { id: "exponent", label: "Exponent", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = monomialAbsentVariableIndicatorTool.execute;
export default monomialAbsentVariableIndicatorTool;
