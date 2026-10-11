import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousAttempts: number;
  readonly attemptRecorded: boolean;
};
export type Output = { readonly updatedAttempts: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousAttempts: { type: "integer", minimum: 0 },
    attemptRecorded: { type: "boolean" },
  },
  required: ["previousAttempts", "attemptRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { updatedAttempts: { type: "integer" } },
  required: ["updatedAttempts"],
} as const;
/** Increment an explicit client-contact attempt count under a supplied attempt flag without contacting anyone. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousAttempts, attemptRecorded } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(previousAttempts) &&
        previousAttempts >= 0 &&
        previousAttempts <= Number.MAX_SAFE_INTEGER,
      "previousAttempts",
    ),
      previousAttempts);
    return {
      updatedAttempts: Number(
        BigInt(previousAttempts) + (attemptRecorded ? 1n : 0n),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousAttempts: 3, attemptRecorded: true },
  output: { updatedAttempts: 4 },
} satisfies ToolExample<Input, Output>;
export const clientContactAttemptCountStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["social-work", "social work", "social sciences"],
      keywords: ["social work", "social sciences"],
    },
    id: "social-work/client-contact-attempt-count-step",
    title: "Client Contact Attempt Count Step",
    description:
      "Increment an explicit client-contact attempt count under a supplied attempt flag without contacting anyone.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousAttempts: { type: "integer", minimum: 0 },
        attemptRecorded: { type: "boolean" },
      },
      required: ["previousAttempts", "attemptRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { updatedAttempts: { type: "integer" } },
      required: ["updatedAttempts"],
    },
    ports: {
      inputs: [
        {
          id: "previousAttempts",
          label: "Previous Attempts",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "attemptRecorded",
          label: "Attempt Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "updatedAttempts",
          label: "Updated Attempts",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = clientContactAttemptCountStepTool.execute;
export default clientContactAttemptCountStepTool;
