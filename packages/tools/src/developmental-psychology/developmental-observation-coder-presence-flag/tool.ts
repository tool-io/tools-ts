import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationRecorded: boolean;
  readonly coderPresent: boolean;
};
export type Output = { readonly uncodedObservation: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationRecorded: { type: "boolean" },
    coderPresent: { type: "boolean" },
  },
  required: ["observationRecorded", "coderPresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { uncodedObservation: { type: "boolean" } },
  required: ["uncodedObservation"],
} as const;
/** Flag a supplied recorded developmental observation without an explicit coder-presence flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationRecorded, coderPresent } = request;
  const compute = (): Output => {
    return { uncodedObservation: observationRecorded && !coderPresent };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observationRecorded: true, coderPresent: false },
  output: { uncodedObservation: true },
} satisfies ToolExample<Input, Output>;
export const developmentalObservationCoderPresenceFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/developmental-observation-coder-presence-flag",
      title: "Developmental Observation Coder Presence Flag Tool",
      description:
        "Flag a supplied recorded developmental observation without an explicit coder-presence flag.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observationRecorded: { type: "boolean" },
          coderPresent: { type: "boolean" },
        },
        required: ["observationRecorded", "coderPresent"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { uncodedObservation: { type: "boolean" } },
        required: ["uncodedObservation"],
      },
      ports: {
        inputs: [
          {
            id: "observationRecorded",
            label: "Observation Recorded",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "coderPresent",
            label: "Coder Present",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "uncodedObservation",
            label: "Uncoded Observation",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = developmentalObservationCoderPresenceFlagTool.execute;
export default developmentalObservationCoderPresenceFlagTool;
