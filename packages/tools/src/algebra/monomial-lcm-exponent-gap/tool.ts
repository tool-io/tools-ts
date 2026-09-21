import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supplied: readonly number[];
  readonly other: readonly number[];
};
export type Output = { readonly gap: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supplied: { type: "array", maxItems: 256, items: { type: "integer" } },
    other: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["supplied", "other"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gap: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["gap"],
} as const;
/** Exponent increments needed to reach the componentwise LCM envelope. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { supplied, other } = request;
  const compute = (): Output => {
    H.sameLength(supplied, other);
    H.domain(supplied.every((x) => x >= 0) && other.every((x) => x >= 0));
    return { gap: supplied.map((x, i) => Math.max(x, other[i]) - x) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { supplied: [2, 1], other: [1, 4] },
  output: { gap: [0, 3] },
} satisfies ToolExample<Input, Output>;
export const monomialLcmExponentGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "algebra/monomial-lcm-exponent-gap",
    title: "Monomial Lcm Exponent Gap Tool",
    description:
      "Exponent increments needed to reach the componentwise LCM envelope.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supplied: { type: "array", maxItems: 256, items: { type: "integer" } },
        other: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["supplied", "other"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "supplied",
          label: "Supplied",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "other",
          label: "Other",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "gap",
          label: "Gap",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = monomialLcmExponentGapTool.execute;
export default monomialLcmExponentGapTool;
