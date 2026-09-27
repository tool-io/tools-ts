import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly produced: number;
  readonly released: number;
  readonly held: number;
  readonly destroyed: number;
  readonly returned: number;
};
export type Output = {
  readonly unassigned: number;
  readonly netReleased: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    produced: { type: "number", minimum: 0 },
    released: { type: "number", minimum: 0 },
    held: { type: "number", minimum: 0 },
    destroyed: { type: "number", minimum: 0 },
    returned: { type: "number", minimum: 0 },
  },
  required: ["produced", "released", "held", "destroyed", "returned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unassigned: { type: "number" },
    netReleased: { type: "number" },
  },
  required: ["unassigned", "netReleased"],
} as const;
/** Calculate food recall lot quantity reconcile from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { produced, released, held, destroyed, returned } = request;
  const compute = (): Output => {
    H.domain(
      produced >= 0 &&
        released >= 0 &&
        held >= 0 &&
        destroyed >= 0 &&
        returned >= 0 &&
        returned <= released &&
        released + held + destroyed <= produced,
    );
    return {
      unassigned: produced - released - held - destroyed,
      netReleased: released - returned,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    produced: 1000,
    released: 800,
    held: 100,
    destroyed: 50,
    returned: 200,
  },
  output: { unassigned: 50, netReleased: 600 },
} satisfies ToolExample<Input, Output>;
export const foodRecallLotQuantityReconcileTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-safety/food-recall-lot-quantity-reconcile",
    title: "Food Recall Lot Quantity Reconcile Tool",
    description:
      "Calculate food recall lot quantity reconcile from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        produced: { type: "number", minimum: 0 },
        released: { type: "number", minimum: 0 },
        held: { type: "number", minimum: 0 },
        destroyed: { type: "number", minimum: 0 },
        returned: { type: "number", minimum: 0 },
      },
      required: ["produced", "released", "held", "destroyed", "returned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unassigned: { type: "number" },
        netReleased: { type: "number" },
      },
      required: ["unassigned", "netReleased"],
    },
    ports: {
      inputs: [
        {
          id: "produced",
          label: "Produced",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "released",
          label: "Released",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "held",
          label: "Held",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "destroyed",
          label: "Destroyed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unassigned",
          label: "Unassigned",
          valueType: { type: "number" },
        },
        {
          id: "netReleased",
          label: "Net Released",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodRecallLotQuantityReconcileTool.execute;
export default foodRecallLotQuantityReconcileTool;
