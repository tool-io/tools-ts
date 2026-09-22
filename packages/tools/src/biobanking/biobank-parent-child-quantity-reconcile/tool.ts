import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly parent: number;
  readonly children: readonly number[];
  readonly retained: number;
  readonly lost: number;
};
export type Output = {
  readonly unaccounted: number;
  readonly allocatedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    parent: { type: "number", exclusiveMinimum: 0 },
    children: { type: "array", maxItems: 256, items: { type: "number" } },
    retained: { type: "number", minimum: 0 },
    lost: { type: "number", minimum: 0 },
  },
  required: ["parent", "children", "retained", "lost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unaccounted: { type: "number" },
    allocatedShare: { type: "number" },
  },
  required: ["unaccounted", "allocatedShare"],
} as const;
/** Calculate biobank parent child quantity reconcile from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { parent, children, retained, lost } = request;
  const compute = (): Output => {
    H.positive(parent);
    H.domain(children.every((x) => x >= 0) && retained >= 0 && lost >= 0);
    return {
      unaccounted:
        parent - children.reduce((a, b) => a + b, 0) - retained - lost,
      allocatedShare: children.reduce((a, b) => a + b, 0) / parent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { parent: 100, children: [20, 30], retained: 40, lost: 5 },
  output: { unaccounted: 5, allocatedShare: 0.5 },
} satisfies ToolExample<Input, Output>;
export const biobankParentChildQuantityReconcileTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biobanking/biobank-parent-child-quantity-reconcile",
      title: "Biobank Parent Child Quantity Reconcile Tool",
      description:
        "Calculate biobank parent child quantity reconcile from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          parent: { type: "number", exclusiveMinimum: 0 },
          children: { type: "array", maxItems: 256, items: { type: "number" } },
          retained: { type: "number", minimum: 0 },
          lost: { type: "number", minimum: 0 },
        },
        required: ["parent", "children", "retained", "lost"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unaccounted: { type: "number" },
          allocatedShare: { type: "number" },
        },
        required: ["unaccounted", "allocatedShare"],
      },
      ports: {
        inputs: [
          {
            id: "parent",
            label: "Parent",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "children",
            label: "Children",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "retained",
            label: "Retained",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lost",
            label: "Lost",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "unaccounted",
            label: "Unaccounted",
            valueType: { type: "number" },
          },
          {
            id: "allocatedShare",
            label: "Allocated Share",
            valueType: { type: "number", unit: "1" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biobankParentChildQuantityReconcileTool.execute;
export default biobankParentChildQuantityReconcileTool;
