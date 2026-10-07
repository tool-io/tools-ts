import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observationId: string;
  readonly intervalId: string;
  readonly suppliedReason: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observationId: { type: "string", maxLength: 8192, minLength: 1 },
    intervalId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReason: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["observationId", "intervalId", "suppliedReason"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied reason for a missed child-study observation interval without imputing behavior. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observationId, intervalId, suppliedReason } = request;
  const compute = (): Output => {
    H.domain(observationId.length > 0, "observationId");
    H.domain(intervalId.length > 0, "intervalId");
    H.domain(suppliedReason.length > 0, "suppliedReason");
    return {
      token: JSON.stringify([observationId, intervalId, suppliedReason]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observationId: "O17",
    intervalId: "I4",
    suppliedReason: "not visible",
  },
  output: { token: '["O17","I4","not visible"]' },
} satisfies ToolExample<Input, Output>;
export const childObservationIntervalMissedCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["child-development", "child development", "psychology"],
      keywords: ["child development", "psychology"],
    },
    id: "child-development/child-observation-interval-missed-code",
    title: "Child Observation Interval Missed Code",
    description:
      "Preserve a supplied reason for a missed child-study observation interval without imputing behavior.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observationId: { type: "string", maxLength: 8192, minLength: 1 },
        intervalId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedReason: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["observationId", "intervalId", "suppliedReason"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "observationId",
          label: "Observation Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "intervalId",
          label: "Interval Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedReason",
          label: "Supplied Reason",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = childObservationIntervalMissedCodeTool.execute;
export default childObservationIntervalMissedCodeTool;
