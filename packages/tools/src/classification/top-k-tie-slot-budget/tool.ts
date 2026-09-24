import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly k: number;
  readonly strictlyHigher: number;
  readonly tied: number;
};
export type Output = {
  readonly remainingSlots: number;
  readonly tieCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    k: { type: "integer", minimum: 1 },
    strictlyHigher: { type: "integer", minimum: 0 },
    tied: { type: "integer", minimum: 1 },
  },
  required: ["k", "strictlyHigher", "tied"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingSlots: { type: "integer" },
    tieCredit: { type: "number" },
  },
  required: ["remainingSlots", "tieCredit"],
} as const;
/** Calculate top k tie slot budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { k, strictlyHigher, tied } = request;
  const compute = (): Output => {
    H.integer(k, 1);
    H.integer(strictlyHigher, 0);
    H.integer(tied, 1);
    const remainingSlots = Math.max(0, Math.min(tied, k - strictlyHigher));
    return { remainingSlots, tieCredit: remainingSlots / tied };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { k: 3, strictlyHigher: 2, tied: 4 },
  output: { remainingSlots: 1, tieCredit: 0.25 },
} satisfies ToolExample<Input, Output>;
export const topKTieSlotBudgetTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "classification/top-k-tie-slot-budget",
    title: "Top K Tie Slot Budget Tool",
    description:
      "Calculate top k tie slot budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        k: { type: "integer", minimum: 1 },
        strictlyHigher: { type: "integer", minimum: 0 },
        tied: { type: "integer", minimum: 1 },
      },
      required: ["k", "strictlyHigher", "tied"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingSlots: { type: "integer" },
        tieCredit: { type: "number" },
      },
      required: ["remainingSlots", "tieCredit"],
    },
    ports: {
      inputs: [
        { id: "k", label: "K", required: true, valueType: { type: "integer" } },
        {
          id: "strictlyHigher",
          label: "Strictly Higher",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tied",
          label: "Tied",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingSlots",
          label: "Remaining Slots",
          valueType: { type: "integer" },
        },
        { id: "tieCredit", label: "Tie Credit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = topKTieSlotBudgetTool.execute;
export default topKTieSlotBudgetTool;
