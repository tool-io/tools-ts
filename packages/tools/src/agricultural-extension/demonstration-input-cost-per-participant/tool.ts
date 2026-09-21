import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputCost: number;
  readonly fixedCost: number;
  readonly participants: number;
  readonly refunded: number;
};
export type Output = {
  readonly netCost: number;
  readonly perParticipant: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputCost: { type: "number", minimum: 0 },
    fixedCost: { type: "number", minimum: 0 },
    participants: { type: "integer", minimum: 1 },
    refunded: { type: "number", minimum: 0 },
  },
  required: ["inputCost", "fixedCost", "participants", "refunded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netCost: { type: "number" },
    perParticipant: { type: "number" },
  },
  required: ["netCost", "perParticipant"],
} as const;
/** Calculate demonstration input cost per participant from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputCost, fixedCost, participants, refunded } = request;
  const compute = (): Output => {
    H.integer(participants, 1);
    H.domain(inputCost >= 0 && fixedCost >= 0 && refunded >= 0);
    return {
      netCost: inputCost + fixedCost - refunded,
      perParticipant: (inputCost + fixedCost - refunded) / participants,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { inputCost: 100, fixedCost: 50, participants: 30, refunded: 0 },
  output: { netCost: 150, perParticipant: 5 },
} satisfies ToolExample<Input, Output>;
export const demonstrationInputCostPerParticipantTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-extension/demonstration-input-cost-per-participant",
      title: "Demonstration Input Cost Per Participant Tool",
      description:
        "Calculate demonstration input cost per participant from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          inputCost: { type: "number", minimum: 0 },
          fixedCost: { type: "number", minimum: 0 },
          participants: { type: "integer", minimum: 1 },
          refunded: { type: "number", minimum: 0 },
        },
        required: ["inputCost", "fixedCost", "participants", "refunded"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netCost: { type: "number" },
          perParticipant: { type: "number" },
        },
        required: ["netCost", "perParticipant"],
      },
      ports: {
        inputs: [
          {
            id: "inputCost",
            label: "Input Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "fixedCost",
            label: "Fixed Cost",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "participants",
            label: "Participants",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "refunded",
            label: "Refunded",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
          {
            id: "perParticipant",
            label: "Per Participant",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = demonstrationInputCostPerParticipantTool.execute;
export default demonstrationInputCostPerParticipantTool;
