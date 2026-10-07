import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousCondition: string;
  readonly currentCondition: string;
};
export type Output = { readonly repeatedCondition: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousCondition: { type: "string", maxLength: 8192, minLength: 1 },
    currentCondition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["previousCondition", "currentCondition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { repeatedCondition: { type: "boolean" } },
  required: ["repeatedCondition"],
} as const;
/** Compare explicit adjacent trial condition identifiers using exact equality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousCondition, currentCondition } = request;
  const compute = (): Output => {
    H.domain(previousCondition.length > 0, "previousCondition");
    H.domain(currentCondition.length > 0, "currentCondition");
    return { repeatedCondition: previousCondition === currentCondition };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousCondition: "A", currentCondition: "A" },
  output: { repeatedCondition: true },
} satisfies ToolExample<Input, Output>;
export const trialOrderRepetitionFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/trial-order-repetition-flag",
    title: "Trial Order Repetition Flag",
    description:
      "Compare explicit adjacent trial condition identifiers using exact equality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousCondition: { type: "string", maxLength: 8192, minLength: 1 },
        currentCondition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["previousCondition", "currentCondition"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { repeatedCondition: { type: "boolean" } },
      required: ["repeatedCondition"],
    },
    ports: {
      inputs: [
        {
          id: "previousCondition",
          label: "Previous Condition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentCondition",
          label: "Current Condition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "repeatedCondition",
          label: "Repeated Condition",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialOrderRepetitionFlagTool.execute;
export default trialOrderRepetitionFlagTool;
