import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderedUnits: readonly number[];
  readonly deliveredUnits: readonly number[];
};
export type Output = {
  readonly lineFill: number;
  readonly unitFill: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedUnits: { type: "array", maxItems: 256, items: { type: "integer" } },
    deliveredUnits: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["orderedUnits", "deliveredUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lineFill: { type: "number" },
    unitFill: { type: "number" },
    gap: { type: "number" },
  },
  required: ["lineFill", "unitFill", "gap"],
} as const;
/** Calculate order fill line versus unit gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderedUnits, deliveredUnits } = request;
  const compute = (): Output => {
    H.sameLength(orderedUnits, deliveredUnits);
    H.domain(
      orderedUnits.length > 0 &&
        orderedUnits.every((x) => x > 0) &&
        deliveredUnits.every((x, i) => x >= 0 && x <= orderedUnits[i]),
    );
    return {
      lineFill:
        orderedUnits.filter((x, i) => deliveredUnits[i] === x).length /
        orderedUnits.length,
      unitFill:
        deliveredUnits.reduce((a, b) => a + b, 0) /
        orderedUnits.reduce((a, b) => a + b, 0),
      gap:
        orderedUnits.filter((x, i) => deliveredUnits[i] === x).length /
          orderedUnits.length -
        deliveredUnits.reduce((a, b) => a + b, 0) /
          orderedUnits.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { orderedUnits: [10, 90], deliveredUnits: [10, 45] },
  output: { lineFill: 0.5, unitFill: 0.55, gap: -0.050000000000000044 },
} satisfies ToolExample<Input, Output>;
export const orderFillLineVersusUnitGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "supply-chain/order-fill-line-versus-unit-gap",
    title: "Order Fill Line Versus Unit Gap Tool",
    description:
      "Calculate order fill line versus unit gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedUnits: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        deliveredUnits: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["orderedUnits", "deliveredUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lineFill: { type: "number" },
        unitFill: { type: "number" },
        gap: { type: "number" },
      },
      required: ["lineFill", "unitFill", "gap"],
    },
    ports: {
      inputs: [
        {
          id: "orderedUnits",
          label: "Ordered Units",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "deliveredUnits",
          label: "Delivered Units",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        { id: "lineFill", label: "Line Fill", valueType: { type: "number" } },
        { id: "unitFill", label: "Unit Fill", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = orderFillLineVersusUnitGapTool.execute;
export default orderFillLineVersusUnitGapTool;
