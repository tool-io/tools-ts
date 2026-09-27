import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cycles: number;
  readonly pulsesPerCycle: number;
  readonly secondsPerPulse: number;
  readonly pickupPulses: number;
};
export type Output = {
  readonly totalPulses: number;
  readonly phraseSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycles: { type: "integer", minimum: 0 },
    pulsesPerCycle: { type: "integer", minimum: 1 },
    secondsPerPulse: { type: "number", exclusiveMinimum: 0 },
    pickupPulses: { type: "integer", minimum: 0 },
  },
  required: ["cycles", "pulsesPerCycle", "secondsPerPulse", "pickupPulses"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalPulses: { type: "integer" },
    phraseSeconds: { type: "number" },
  },
  required: ["totalPulses", "phraseSeconds"],
} as const;
/** Calculate authorized dance music phrase length from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cycles, pulsesPerCycle, secondsPerPulse, pickupPulses } = request;
  const compute = (): Output => {
    H.integer(cycles, 0);
    H.integer(pulsesPerCycle, 1);
    H.integer(pickupPulses, 0);
    H.positive(secondsPerPulse);
    return {
      totalPulses: cycles * pulsesPerCycle + pickupPulses,
      phraseSeconds: (cycles * pulsesPerCycle + pickupPulses) * secondsPerPulse,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cycles: 4,
    pulsesPerCycle: 8,
    secondsPerPulse: 0.5,
    pickupPulses: 2,
  },
  output: { totalPulses: 34, phraseSeconds: 17 },
} satisfies ToolExample<Input, Output>;
export const authorizedDanceMusicPhraseLengthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/authorized-dance-music-phrase-length",
    title: "Authorized Dance Music Phrase Length Tool",
    description:
      "Calculate authorized dance music phrase length from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycles: { type: "integer", minimum: 0 },
        pulsesPerCycle: { type: "integer", minimum: 1 },
        secondsPerPulse: { type: "number", exclusiveMinimum: 0 },
        pickupPulses: { type: "integer", minimum: 0 },
      },
      required: ["cycles", "pulsesPerCycle", "secondsPerPulse", "pickupPulses"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalPulses: { type: "integer" },
        phraseSeconds: { type: "number" },
      },
      required: ["totalPulses", "phraseSeconds"],
    },
    ports: {
      inputs: [
        {
          id: "cycles",
          label: "Cycles",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pulsesPerCycle",
          label: "Pulses Per Cycle",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondsPerPulse",
          label: "Seconds Per Pulse",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pickupPulses",
          label: "Pickup Pulses",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "totalPulses",
          label: "Total Pulses",
          valueType: { type: "integer" },
        },
        {
          id: "phraseSeconds",
          label: "Phrase Seconds",
          valueType: { type: "number", unit: "s" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorizedDanceMusicPhraseLengthTool.execute;
export default authorizedDanceMusicPhraseLengthTool;
