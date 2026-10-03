import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly response: string;
  readonly declinedToken: string;
  readonly missingToken: string;
};
export type Output = {
  readonly declined: boolean;
  readonly missing: boolean;
  readonly answered: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    response: { type: "string", maxLength: 8192 },
    declinedToken: { type: "string", maxLength: 8192 },
    missingToken: { type: "string", maxLength: 8192 },
  },
  required: ["response", "declinedToken", "missingToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    declined: { type: "boolean" },
    missing: { type: "boolean" },
    answered: { type: "boolean" },
  },
  required: ["declined", "missing", "answered"],
} as const;
/** Keep an explicitly declined goal separate from missing and answered records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { response, declinedToken, missingToken } = request;
  const compute = (): Output => {
    H.domain(declinedToken !== missingToken);
    return {
      declined: response === declinedToken,
      missing: response === missingToken,
      answered: response !== declinedToken && response !== missingToken,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { response: "declined", declinedToken: "declined", missingToken: "" },
  output: { declined: true, missing: false, answered: false },
} satisfies ToolExample<Input, Output>;
export const clientGoalDeclinedItemTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/client-goal-declined-item-token",
    title: "Client Goal Declined Item Token Tool",
    description:
      "Keep an explicitly declined goal separate from missing and answered records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        response: { type: "string", maxLength: 8192 },
        declinedToken: { type: "string", maxLength: 8192 },
        missingToken: { type: "string", maxLength: 8192 },
      },
      required: ["response", "declinedToken", "missingToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        declined: { type: "boolean" },
        missing: { type: "boolean" },
        answered: { type: "boolean" },
      },
      required: ["declined", "missing", "answered"],
    },
    ports: {
      inputs: [
        {
          id: "response",
          label: "Response",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "declinedToken",
          label: "Declined Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "missingToken",
          label: "Missing Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "declined", label: "Declined", valueType: { type: "boolean" } },
        { id: "missing", label: "Missing", valueType: { type: "boolean" } },
        { id: "answered", label: "Answered", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = clientGoalDeclinedItemTokenTool.execute;
export default clientGoalDeclinedItemTokenTool;
