import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredFields: readonly string[];
  readonly presentFields: readonly string[];
};
export type Output = {
  readonly presentRequired: number;
  readonly missingRequired: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    presentFields: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["requiredFields", "presentFields"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    presentRequired: { type: "integer" },
    missingRequired: { type: "integer" },
  },
  required: ["presentRequired", "missingRequired"],
} as const;
/** Count caller-supplied handoff field presence without evaluating clinical adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredFields, presentFields } = request;
  const compute = (): Output => {
    return {
      presentRequired: new Set(
        requiredFields.filter((x) => presentFields.includes(x)),
      ).size,
      missingRequired: new Set(
        requiredFields.filter((x) => !presentFields.includes(x)),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredFields: ["id", "time"], presentFields: ["id"] },
  output: { presentRequired: 1, missingRequired: 1 },
} satisfies ToolExample<Input, Output>;
export const handoffFieldPresenceCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "emergency-medicine/handoff-field-presence-count",
    title: "Handoff Field Presence Count Tool",
    description:
      "Count caller-supplied handoff field presence without evaluating clinical adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        presentFields: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["requiredFields", "presentFields"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        presentRequired: { type: "integer" },
        missingRequired: { type: "integer" },
      },
      required: ["presentRequired", "missingRequired"],
    },
    ports: {
      inputs: [
        {
          id: "requiredFields",
          label: "Required Fields",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "presentFields",
          label: "Present Fields",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "presentRequired",
          label: "Present Required",
          valueType: { type: "integer" },
        },
        {
          id: "missingRequired",
          label: "Missing Required",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = handoffFieldPresenceCountTool.execute;
export default handoffFieldPresenceCountTool;
