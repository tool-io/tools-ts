import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly quantities: readonly number[];
  readonly unitsPerQuantity: readonly number[];
};
export type Output = {
  readonly lineUnits: readonly number[];
  readonly totalUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    quantities: { type: "array", maxItems: 256, items: { type: "integer" } },
    unitsPerQuantity: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["quantities", "unitsPerQuantity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineUnits: { type: "array", maxItems: 256, items: { type: "integer" } },
    totalUnits: { type: "integer" },
  },
  required: ["lineUnits", "totalUnits"],
} as const;
/** Expand supplied mixed packaging quantities into base inventory units without medication dose conversion. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { quantities, unitsPerQuantity } = request;
  const compute = (): Output => {
    H.sameLength(quantities, unitsPerQuantity);
    H.domain(
      quantities.every((x) => x >= 0) && unitsPerQuantity.every((x) => x >= 1),
    );
    const exact = quantities.map(
      (x, i) => BigInt(x) * BigInt(unitsPerQuantity[i]),
    );
    return {
      lineUnits: exact.map(Number),
      totalUnits: Number(exact.reduce((a, b) => a + b, 0n)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { quantities: [2, 3, 5], unitsPerQuantity: [10, 4, 1] },
  output: { lineUnits: [20, 12, 5], totalUnits: 37 },
} satisfies ToolExample<Input, Output>;
export const pharmacyToteMixedUnitLineExpanderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/pharmacy-tote-mixed-unit-line-expander",
    title: "Pharmacy Tote Mixed Unit Line Expander Tool",
    description:
      "Expand supplied mixed packaging quantities into base inventory units without medication dose conversion.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        quantities: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        unitsPerQuantity: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["quantities", "unitsPerQuantity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineUnits: { type: "array", maxItems: 256, items: { type: "integer" } },
        totalUnits: { type: "integer" },
      },
      required: ["lineUnits", "totalUnits"],
    },
    ports: {
      inputs: [
        {
          id: "quantities",
          label: "Quantities",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "unitsPerQuantity",
          label: "Units Per Quantity",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "lineUnits",
          label: "Line Units",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "totalUnits",
          label: "Total Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacyToteMixedUnitLineExpanderTool.execute;
export default pharmacyToteMixedUnitLineExpanderTool;
