import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly references: readonly string[];
  readonly requestedSection: string;
};
export type Output = { readonly count: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    references: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedSection: { type: "string", maxLength: 8192 },
  },
  required: ["references", "requestedSection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { count: { type: "integer" } },
  required: ["count"],
} as const;
/** Count exact supplied public label-section references without reviewing medical or regulatory adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { references, requestedSection } = request;
  const compute = (): Output => {
    return { count: references.filter((x) => x === requestedSection).length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { references: ["A", "B", "A"], requestedSection: "A" },
  output: { count: 2 },
} satisfies ToolExample<Input, Output>;
export const labelSectionReferenceCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "regulatory-affairs/label-section-reference-count",
    title: "Label Section Reference Count Tool",
    description:
      "Count exact supplied public label-section references without reviewing medical or regulatory adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        references: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requestedSection: { type: "string", maxLength: 8192 },
      },
      required: ["references", "requestedSection"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { count: { type: "integer" } },
      required: ["count"],
    },
    ports: {
      inputs: [
        {
          id: "references",
          label: "References",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requestedSection",
          label: "Requested Section",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "count", label: "Count", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = labelSectionReferenceCountTool.execute;
export default labelSectionReferenceCountTool;
