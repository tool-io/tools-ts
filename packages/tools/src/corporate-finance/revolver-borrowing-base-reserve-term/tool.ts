import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleCollateralValue: number;
  readonly advanceFraction: number;
  readonly suppliedReserve: number;
};
export type Output = { readonly grossBase: number; readonly netBase: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleCollateralValue: { type: "number", minimum: 0 },
    advanceFraction: { type: "number", minimum: 0, maximum: 1 },
    suppliedReserve: { type: "number", minimum: 0 },
  },
  required: ["eligibleCollateralValue", "advanceFraction", "suppliedReserve"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { grossBase: { type: "number" }, netBase: { type: "number" } },
  required: ["grossBase", "netBase"],
} as const;
/** Apply explicit advance fraction and reserve to supplied eligible collateral without determining collateral eligibility. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleCollateralValue, advanceFraction, suppliedReserve } = request;
  const compute = (): Output => {
    H.domain(eligibleCollateralValue >= 0, "eligibleCollateralValue");
    (H.domain(advanceFraction >= 0 && advanceFraction <= 1, "advanceFraction"),
      advanceFraction);
    H.domain(suppliedReserve >= 0, "suppliedReserve");
    return {
      grossBase: eligibleCollateralValue * advanceFraction,
      netBase: eligibleCollateralValue * advanceFraction - suppliedReserve,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleCollateralValue: 1000,
    advanceFraction: 0.8,
    suppliedReserve: 100,
  },
  output: { grossBase: 800, netBase: 700 },
} satisfies ToolExample<Input, Output>;
export const revolverBorrowingBaseReserveTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "trading"],
      fields: [
        "corporate-finance",
        "corporate finance",
        "business and finance",
      ],
      keywords: ["corporate finance", "business and finance"],
    },
    id: "corporate-finance/revolver-borrowing-base-reserve-term",
    title: "Revolver Borrowing Base Reserve Term",
    description:
      "Apply explicit advance fraction and reserve to supplied eligible collateral without determining collateral eligibility.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleCollateralValue: { type: "number", minimum: 0 },
        advanceFraction: { type: "number", minimum: 0, maximum: 1 },
        suppliedReserve: { type: "number", minimum: 0 },
      },
      required: [
        "eligibleCollateralValue",
        "advanceFraction",
        "suppliedReserve",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossBase: { type: "number" },
        netBase: { type: "number" },
      },
      required: ["grossBase", "netBase"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleCollateralValue",
          label: "Eligible Collateral Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "advanceFraction",
          label: "Advance Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedReserve",
          label: "Supplied Reserve",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grossBase", label: "Gross Base", valueType: { type: "number" } },
        { id: "netBase", label: "Net Base", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = revolverBorrowingBaseReserveTermTool.execute;
export default revolverBorrowingBaseReserveTermTool;
