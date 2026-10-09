import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly beliefId: string;
  readonly defeaterId: string;
  readonly retractionEventId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beliefId: { type: "string", maxLength: 8192, minLength: 1 },
    defeaterId: { type: "string", maxLength: 8192, minLength: 1 },
    retractionEventId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["beliefId", "defeaterId", "retractionEventId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Associate an explicit belief, defeater and retraction event without performing belief revision. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beliefId, defeaterId, retractionEventId } = request;
  const compute = (): Output => {
    H.domain(beliefId.length > 0, "beliefId");
    H.domain(defeaterId.length > 0, "defeaterId");
    H.domain(retractionEventId.length > 0, "retractionEventId");
    return { token: JSON.stringify([beliefId, defeaterId, retractionEventId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beliefId: "B17", defeaterId: "D4", retractionEventId: "E2" },
  output: { token: '["B17","D4","E2"]' },
} satisfies ToolExample<Input, Output>;
export const defeaterRetractionEventTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/defeater-retraction-event-token",
    title: "Defeater Retraction Event Token Tool",
    description:
      "Associate an explicit belief, defeater and retraction event without performing belief revision.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beliefId: { type: "string", maxLength: 8192, minLength: 1 },
        defeaterId: { type: "string", maxLength: 8192, minLength: 1 },
        retractionEventId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["beliefId", "defeaterId", "retractionEventId"],
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
          id: "beliefId",
          label: "Belief Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "defeaterId",
          label: "Defeater Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "retractionEventId",
          label: "Retraction Event Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = defeaterRetractionEventTokenTool.execute;
export default defeaterRetractionEventTokenTool;
