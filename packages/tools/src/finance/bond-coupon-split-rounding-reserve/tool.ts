import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalMinorUnits: number;
  readonly shares: readonly number[];
};
export type Output = {
  readonly allocatedMinorUnits: readonly number[];
  readonly reserveMinorUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMinorUnits: { type: "integer", minimum: 0 },
    shares: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["totalMinorUnits", "shares"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allocatedMinorUnits: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    reserveMinorUnits: { type: "integer" },
  },
  required: ["allocatedMinorUnits", "reserveMinorUnits"],
} as const;
/** Floor each supplied coupon allocation in minor units and preserve the unallocated reserve. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalMinorUnits, shares } = request;
  const compute = (): Output => {
    H.integer(totalMinorUnits, 0);
    H.domain(
      shares.length > 0 &&
        shares.every((x) => x >= 0 && x <= 1) &&
        Math.abs(shares.reduce((s, x) => s + x, 0) - 1) <= 1e-12,
    );
    return {
      allocatedMinorUnits: shares.map((x) => Math.floor(totalMinorUnits * x)),
      reserveMinorUnits:
        totalMinorUnits -
        shares.reduce((s, x) => s + Math.floor(totalMinorUnits * x), 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalMinorUnits: 101, shares: [0.5, 0.5] },
  output: { allocatedMinorUnits: [50, 50], reserveMinorUnits: 1 },
} satisfies ToolExample<Input, Output>;
export const bondCouponSplitRoundingReserveTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/bond-coupon-split-rounding-reserve",
    title: "Bond Coupon Split Rounding Reserve Tool",
    description:
      "Floor each supplied coupon allocation in minor units and preserve the unallocated reserve.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMinorUnits: { type: "integer", minimum: 0 },
        shares: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["totalMinorUnits", "shares"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allocatedMinorUnits: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        reserveMinorUnits: { type: "integer" },
      },
      required: ["allocatedMinorUnits", "reserveMinorUnits"],
    },
    ports: {
      inputs: [
        {
          id: "totalMinorUnits",
          label: "Total Minor Units",
          required: true,
          valueType: { type: "integer" },
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
          id: "allocatedMinorUnits",
          label: "Allocated Minor Units",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "reserveMinorUnits",
          label: "Reserve Minor Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = bondCouponSplitRoundingReserveTool.execute;
export default bondCouponSplitRoundingReserveTool;
