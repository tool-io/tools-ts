import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coreSectionId: string;
  readonly splitHalf: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coreSectionId: { type: "string", maxLength: 8192, minLength: 1 },
    splitHalf: {
      type: "string",
      maxLength: 8192,
      enum: ["archive", "working", "unspecified"],
    },
  },
  required: ["coreSectionId", "splitHalf"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied sediment-core split-half role without inferring storage or sampling rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coreSectionId, splitHalf } = request;
  const compute = (): Output => {
    H.domain(coreSectionId.length > 0, "coreSectionId");
    H.domain(
      ["archive", "working", "unspecified"].includes(splitHalf),
      "splitHalf",
    );
    return { label: coreSectionId + " [" + splitHalf + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coreSectionId: "C17", splitHalf: "archive" },
  output: { label: "C17 [archive]" },
} satisfies ToolExample<Input, Output>;
export const sedimentCoreSplitHalfLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/sediment-core-split-half-label",
    title: "Sediment Core Split Half Label Tool",
    description:
      "Label an explicitly supplied sediment-core split-half role without inferring storage or sampling rights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coreSectionId: { type: "string", maxLength: 8192, minLength: 1 },
        splitHalf: {
          type: "string",
          maxLength: 8192,
          enum: ["archive", "working", "unspecified"],
        },
      },
      required: ["coreSectionId", "splitHalf"],
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
          id: "coreSectionId",
          label: "Core Section Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "splitHalf",
          label: "Split Half",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sedimentCoreSplitHalfLabelTool.execute;
export default sedimentCoreSplitHalfLabelTool;
