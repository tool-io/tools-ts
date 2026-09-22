import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conditions: number;
  readonly participant: number;
  readonly slot: number;
};
export type Output = { readonly condition: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditions: { type: "integer", minimum: 1 },
    participant: { type: "integer", minimum: 0 },
    slot: { type: "integer", minimum: 0 },
  },
  required: ["conditions", "participant", "slot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { condition: { type: "integer" } },
  required: ["condition"],
} as const;
/** Cyclic Latin-square row assignment, excluding randomized or balanced carryover designs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conditions, participant, slot } = request;
  const compute = (): Output => {
    H.integer(conditions, 1);
    H.integer(participant, 0);
    H.integer(slot, 0, conditions - 1);
    return { condition: H.mod(participant + slot, conditions) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { conditions: 4, participant: 2, slot: 3 },
  output: { condition: 1 },
} satisfies ToolExample<Input, Output>;
export const stimulusCounterbalanceOneSlotIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/stimulus-counterbalance-one-slot-index",
    title: "Stimulus Counterbalance One Slot Index Tool",
    description:
      "Cyclic Latin-square row assignment, excluding randomized or balanced carryover designs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditions: { type: "integer", minimum: 1 },
        participant: { type: "integer", minimum: 0 },
        slot: { type: "integer", minimum: 0 },
      },
      required: ["conditions", "participant", "slot"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { condition: { type: "integer" } },
      required: ["condition"],
    },
    ports: {
      inputs: [
        {
          id: "conditions",
          label: "Conditions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "participant",
          label: "Participant",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "slot",
          label: "Slot",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "condition", label: "Condition", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = stimulusCounterbalanceOneSlotIndexTool.execute;
export default stimulusCounterbalanceOneSlotIndexTool;
