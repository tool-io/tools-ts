import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly carePlanId: string;
  readonly contactId: string;
  readonly priorityText: string;
  readonly sourceId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    carePlanId: { type: "string", maxLength: 8192, minLength: 1 },
    contactId: { type: "string", maxLength: 8192, minLength: 1 },
    priorityText: { type: "string", maxLength: 8192, minLength: 1 },
    sourceId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["carePlanId", "contactId", "priorityText", "sourceId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve a supplied care-plan contact priority and source without deciding emergency contact order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { carePlanId, contactId, priorityText, sourceId } = request;
  const compute = (): Output => {
    H.domain(carePlanId.length > 0, "carePlanId");
    H.domain(contactId.length > 0, "contactId");
    H.domain(priorityText.length > 0, "priorityText");
    H.domain(sourceId.length > 0, "sourceId");
    return {
      token: JSON.stringify([carePlanId, contactId, priorityText, sourceId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    carePlanId: "P17",
    contactId: "C4",
    priorityText: "first",
    sourceId: "S2",
  },
  output: { token: '["P17","C4","first","S2"]' },
} satisfies ToolExample<Input, Output>;
export const carePlanContactPrioritySourceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/care-plan-contact-priority-source-token",
    title: "Care Plan Contact Priority Source Token Tool",
    description:
      "Preserve a supplied care-plan contact priority and source without deciding emergency contact order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        carePlanId: { type: "string", maxLength: 8192, minLength: 1 },
        contactId: { type: "string", maxLength: 8192, minLength: 1 },
        priorityText: { type: "string", maxLength: 8192, minLength: 1 },
        sourceId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["carePlanId", "contactId", "priorityText", "sourceId"],
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
          id: "carePlanId",
          label: "Care Plan Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "contactId",
          label: "Contact Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "priorityText",
          label: "Priority Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = carePlanContactPrioritySourceTokenTool.execute;
export default carePlanContactPrioritySourceTokenTool;
