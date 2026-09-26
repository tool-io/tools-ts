import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantities: readonly number[];
  readonly unitToCommon: readonly number[];
  readonly verified: readonly boolean[];
};
export type Output = {
  readonly totalCommonQuantity: number;
  readonly verifiedCommonQuantity: number;
  readonly verifiedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantities: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    unitToCommon: { type: "array", maxItems: 256, items: { type: "number" } },
    verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["quantities", "unitToCommon", "verified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalCommonQuantity: { type: "number" },
    verifiedCommonQuantity: { type: "number" },
    verifiedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "totalCommonQuantity",
    "verifiedCommonQuantity",
    "verifiedShare",
    "defined",
  ],
} as const;
/** Calculate archival trade quantity share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantities, unitToCommon, verified } = request;
  const compute = (): Output => {
    H.sameLength(quantities, unitToCommon);
    H.sameLength(quantities, verified);
    H.domain(
      quantities.every((x) => x >= 0) && unitToCommon.every((x) => x > 0),
    );
    return (() => {
      const totalCommonQuantity = quantities.reduce(
          (s, x, i) => s + x * unitToCommon[i],
          0,
        ),
        verifiedCommonQuantity = quantities.reduce(
          (s, x, i) => s + (verified[i] ? x * unitToCommon[i] : 0),
          0,
        );
      return {
        totalCommonQuantity,
        verifiedCommonQuantity,
        verifiedShare:
          totalCommonQuantity > 0
            ? verifiedCommonQuantity / totalCommonQuantity
            : 0,
        defined: totalCommonQuantity > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantities: [2, 3], unitToCommon: [2, 1], verified: [true, false] },
  output: {
    totalCommonQuantity: 7,
    verifiedCommonQuantity: 4,
    verifiedShare: 0.5714285714285714,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const archivalTradeQuantityShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/archival-trade-quantity-share",
    title: "Archival Trade Quantity Share Tool",
    description:
      "Calculate archival trade quantity share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantities: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        unitToCommon: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["quantities", "unitToCommon", "verified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalCommonQuantity: { type: "number" },
        verifiedCommonQuantity: { type: "number" },
        verifiedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "totalCommonQuantity",
        "verifiedCommonQuantity",
        "verifiedShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "quantities",
          label: "Quantities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "unitToCommon",
          label: "Unit To Common",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "verified",
          label: "Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "totalCommonQuantity",
          label: "Total Common Quantity",
          valueType: { type: "number" },
        },
        {
          id: "verifiedCommonQuantity",
          label: "Verified Common Quantity",
          valueType: { type: "number" },
        },
        {
          id: "verifiedShare",
          label: "Verified Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = archivalTradeQuantityShareTool.execute;
export default archivalTradeQuantityShareTool;
