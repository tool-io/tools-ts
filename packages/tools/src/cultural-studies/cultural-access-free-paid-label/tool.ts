import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventId: string;
  readonly accessCategory: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventId: { type: "string", maxLength: 8192, minLength: 1 },
    accessCategory: {
      type: "string",
      maxLength: 8192,
      enum: ["free", "paid", "mixed", "unspecified"],
    },
  },
  required: ["eventId", "accessCategory"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly reported cultural-event access category without assessing affordability or entry rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventId, accessCategory } = request;
  const compute = (): Output => {
    H.domain(eventId.length > 0, "eventId");
    H.domain(
      ["free", "paid", "mixed", "unspecified"].includes(accessCategory),
      "accessCategory",
    );
    return { label: eventId + " [" + accessCategory + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventId: "EV17", accessCategory: "mixed" },
  output: { label: "EV17 [mixed]" },
} satisfies ToolExample<Input, Output>;
export const culturalAccessFreePaidLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["cultural-studies", "cultural studies", "humanities"],
      keywords: ["cultural studies", "humanities"],
    },
    id: "cultural-studies/cultural-access-free-paid-label",
    title: "Cultural Access Free Paid Label",
    description:
      "Label an explicitly reported cultural-event access category without assessing affordability or entry rights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventId: { type: "string", maxLength: 8192, minLength: 1 },
        accessCategory: {
          type: "string",
          maxLength: 8192,
          enum: ["free", "paid", "mixed", "unspecified"],
        },
      },
      required: ["eventId", "accessCategory"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "eventId",
          label: "Event Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "accessCategory",
          label: "Access Category",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = culturalAccessFreePaidLabelTool.execute;
export default culturalAccessFreePaidLabelTool;
