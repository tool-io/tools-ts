import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly anchor: number;
  readonly estimate: number;
  readonly reference: number;
};
export type Output = {
  readonly adjustment: number;
  readonly neededAdjustment: number;
  readonly fraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anchor: { type: "number" },
    estimate: { type: "number" },
    reference: { type: "number" },
  },
  required: ["anchor", "estimate", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    adjustment: { type: "number" },
    neededAdjustment: { type: "number" },
    fraction: { type: "number" },
  },
  required: ["adjustment", "neededAdjustment", "fraction"],
} as const;
/** Calculate anchoring adjustment fraction term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { anchor, estimate, reference } = request;
  const compute = (): Output => {
    H.domain(reference !== anchor);
    return {
      adjustment: estimate - anchor,
      neededAdjustment: reference - anchor,
      fraction: (estimate - anchor) / (reference - anchor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { anchor: 100, estimate: 120, reference: 150 },
  output: { adjustment: 20, neededAdjustment: 50, fraction: 0.4 },
} satisfies ToolExample<Input, Output>;
export const anchoringAdjustmentFractionTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-economics/anchoring-adjustment-fraction-term",
    title: "Anchoring Adjustment Fraction Term Tool",
    description:
      "Calculate anchoring adjustment fraction term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anchor: { type: "number" },
        estimate: { type: "number" },
        reference: { type: "number" },
      },
      required: ["anchor", "estimate", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        adjustment: { type: "number" },
        neededAdjustment: { type: "number" },
        fraction: { type: "number" },
      },
      required: ["adjustment", "neededAdjustment", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "anchor",
          label: "Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "estimate",
          label: "Estimate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "adjustment",
          label: "Adjustment",
          valueType: { type: "number" },
        },
        {
          id: "neededAdjustment",
          label: "Needed Adjustment",
          valueType: { type: "number" },
        },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = anchoringAdjustmentFractionTermTool.execute;
export default anchoringAdjustmentFractionTermTool;
