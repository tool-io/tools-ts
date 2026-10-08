import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPropId: string;
  readonly laterPropId: string;
};
export type Output = { readonly sameProp: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPropId: { type: "string", maxLength: 8192, minLength: 1 },
    laterPropId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["firstPropId", "laterPropId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sameProp: { type: "boolean" } },
  required: ["sameProp"],
} as const;
/** Compare two explicit story prop identifiers using exact case-sensitive equality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPropId, laterPropId } = request;
  const compute = (): Output => {
    H.domain(firstPropId.length > 0, "firstPropId");
    H.domain(laterPropId.length > 0, "laterPropId");
    return { sameProp: firstPropId === laterPropId };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstPropId: "P17", laterPropId: "P17" },
  output: { sameProp: true },
} satisfies ToolExample<Input, Output>;
export const storyRepeatedPropReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/story-repeated-prop-reference",
    title: "Story Repeated Prop Reference",
    description:
      "Compare two explicit story prop identifiers using exact case-sensitive equality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPropId: { type: "string", maxLength: 8192, minLength: 1 },
        laterPropId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["firstPropId", "laterPropId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sameProp: { type: "boolean" } },
      required: ["sameProp"],
    },
    ports: {
      inputs: [
        {
          id: "firstPropId",
          label: "First Prop Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "laterPropId",
          label: "Later Prop Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "sameProp", label: "Same Prop", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = storyRepeatedPropReferenceTool.execute;
export default storyRepeatedPropReferenceTool;
