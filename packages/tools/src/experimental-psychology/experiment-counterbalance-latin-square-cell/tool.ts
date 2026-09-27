import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly conditions: readonly string[];
  readonly participantIndex: number;
  readonly trialIndex: number;
};
export type Output = {
  readonly condition: string;
  readonly conditionIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    participantIndex: { type: "integer", minimum: 0 },
    trialIndex: { type: "integer", minimum: 0 },
  },
  required: ["conditions", "participantIndex", "trialIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    condition: { type: "string", maxLength: 8192 },
    conditionIndex: { type: "integer" },
  },
  required: ["condition", "conditionIndex"],
} as const;
/** Cyclic Latin-square cell, not a Williams square or a randomized counterbalancing schedule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { conditions, participantIndex, trialIndex } = request;
  const compute = (): Output => {
    H.domain(
      conditions.length > 0 && new Set(conditions).size === conditions.length,
    );
    H.integer(participantIndex, 0);
    H.integer(trialIndex, 0);
    const conditionIndex =
      ((participantIndex % conditions.length) +
        (trialIndex % conditions.length)) %
      conditions.length;
    return { condition: conditions[conditionIndex], conditionIndex };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { conditions: ["A", "B", "C"], participantIndex: 1, trialIndex: 2 },
  output: { condition: "A", conditionIndex: 0 },
} satisfies ToolExample<Input, Output>;
export const experimentCounterbalanceLatinSquareCellTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "experimental-psychology/experiment-counterbalance-latin-square-cell",
      title: "Experiment Counterbalance Latin Square Cell Tool",
      description:
        "Cyclic Latin-square cell, not a Williams square or a randomized counterbalancing schedule.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditions: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          participantIndex: { type: "integer", minimum: 0 },
          trialIndex: { type: "integer", minimum: 0 },
        },
        required: ["conditions", "participantIndex", "trialIndex"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          condition: { type: "string", maxLength: 8192 },
          conditionIndex: { type: "integer" },
        },
        required: ["condition", "conditionIndex"],
      },
      ports: {
        inputs: [
          {
            id: "conditions",
            label: "Conditions",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "participantIndex",
            label: "Participant Index",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "trialIndex",
            label: "Trial Index",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "condition",
            label: "Condition",
            valueType: { type: "string" },
          },
          {
            id: "conditionIndex",
            label: "Condition Index",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = experimentCounterbalanceLatinSquareCellTool.execute;
export default experimentCounterbalanceLatinSquareCellTool;
