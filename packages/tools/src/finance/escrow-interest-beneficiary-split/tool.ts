import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly interest: number;
  readonly shares: readonly number[];
};
export type Output = { readonly allocations: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    interest: { type: "number" },
    shares: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["interest", "shares"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocations: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["allocations"],
} as const;
/** Calculate escrow interest beneficiary split from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { interest, shares } = request;
  const compute = (): Output => {
    H.domain(
      shares.length > 0 &&
        shares.every((x) => x >= 0) &&
        Math.abs(shares.reduce((a, b) => a + b, 0) - 1) <= 1e-12,
    );
    return { allocations: shares.map((x) => x * interest) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { interest: 120, shares: [0.25, 0.75] },
  output: { allocations: [30, 90] },
} satisfies ToolExample<Input, Output>;
export const escrowInterestBeneficiarySplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/escrow-interest-beneficiary-split",
    title: "Escrow Interest Beneficiary Split Tool",
    description:
      "Calculate escrow interest beneficiary split from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        interest: { type: "number" },
        shares: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["interest", "shares"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocations: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["allocations"],
    },
    ports: {
      inputs: [
        {
          id: "interest",
          label: "Interest",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "shares",
          label: "Shares",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "allocations",
          label: "Allocations",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = escrowInterestBeneficiarySplitTool.execute;
export default escrowInterestBeneficiarySplitTool;
