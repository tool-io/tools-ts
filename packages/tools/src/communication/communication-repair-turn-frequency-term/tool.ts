import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly repairTurns: number;
  readonly totalTurns: number;
};
export type Output = {
  readonly frequency: number;
  readonly perHundredTurns: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repairTurns: { type: "integer", minimum: 0 },
    totalTurns: { type: "integer", minimum: 1 },
  },
  required: ["repairTurns", "totalTurns"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequency: { type: "number" },
    perHundredTurns: { type: "number" },
  },
  required: ["frequency", "perHundredTurns"],
} as const;
/** Calculate communication repair turn frequency term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { repairTurns, totalTurns } = request;
  const compute = (): Output => {
    H.integer(totalTurns, 1);
    H.integer(repairTurns, 0, totalTurns);
    return {
      frequency: repairTurns / totalTurns,
      perHundredTurns: (100 * repairTurns) / totalTurns,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { repairTurns: 6, totalTurns: 40 },
  output: { frequency: 0.15, perHundredTurns: 15 },
} satisfies ToolExample<Input, Output>;
export const communicationRepairTurnFrequencyTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "communication/communication-repair-turn-frequency-term",
      title: "Communication Repair Turn Frequency Term Tool",
      description:
        "Calculate communication repair turn frequency term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          repairTurns: { type: "integer", minimum: 0 },
          totalTurns: { type: "integer", minimum: 1 },
        },
        required: ["repairTurns", "totalTurns"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          frequency: { type: "number" },
          perHundredTurns: { type: "number" },
        },
        required: ["frequency", "perHundredTurns"],
      },
      ports: {
        inputs: [
          {
            id: "repairTurns",
            label: "Repair Turns",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "totalTurns",
            label: "Total Turns",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "frequency",
            label: "Frequency",
            valueType: { type: "number" },
          },
          {
            id: "perHundredTurns",
            label: "Per Hundred Turns",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = communicationRepairTurnFrequencyTermTool.execute;
export default communicationRepairTurnFrequencyTermTool;
