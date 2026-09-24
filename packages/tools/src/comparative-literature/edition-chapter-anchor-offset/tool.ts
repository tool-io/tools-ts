import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceChapter: number;
  readonly sourceAnchor: number;
  readonly targetAnchor: number;
};
export type Output = { readonly targetChapter: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceChapter: { type: "integer", minimum: 1 },
    sourceAnchor: { type: "integer", minimum: 1 },
    targetAnchor: { type: "integer", minimum: 1 },
  },
  required: ["sourceChapter", "sourceAnchor", "targetAnchor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetChapter: { type: "integer" } },
  required: ["targetChapter"],
} as const;
/** Apply an explicitly supplied constant chapter-anchor offset without establishing textual correspondence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceChapter, sourceAnchor, targetAnchor } = request;
  const compute = (): Output => {
    H.integer(sourceChapter, 1);
    H.integer(sourceAnchor, 1);
    H.integer(targetAnchor, 1);
    H.domain(
      sourceChapter - sourceAnchor + targetAnchor >= 1,
      "sourceChapter",
      "The mapped chapter must be positive.",
    );
    return { targetChapter: sourceChapter - sourceAnchor + targetAnchor };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceChapter: 7, sourceAnchor: 3, targetAnchor: 5 },
  output: { targetChapter: 9 },
} satisfies ToolExample<Input, Output>;
export const editionChapterAnchorOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/edition-chapter-anchor-offset",
    title: "Edition Chapter Anchor Offset Tool",
    description:
      "Apply an explicitly supplied constant chapter-anchor offset without establishing textual correspondence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceChapter: { type: "integer", minimum: 1 },
        sourceAnchor: { type: "integer", minimum: 1 },
        targetAnchor: { type: "integer", minimum: 1 },
      },
      required: ["sourceChapter", "sourceAnchor", "targetAnchor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetChapter: { type: "integer" } },
      required: ["targetChapter"],
    },
    ports: {
      inputs: [
        {
          id: "sourceChapter",
          label: "Source Chapter",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sourceAnchor",
          label: "Source Anchor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "targetAnchor",
          label: "Target Anchor",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "targetChapter",
          label: "Target Chapter",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = editionChapterAnchorOffsetTool.execute;
export default editionChapterAnchorOffsetTool;
