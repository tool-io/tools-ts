import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly passageId: string;
  readonly perspective: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    passageId: { type: "string", maxLength: 8192, minLength: 1 },
    perspective: {
      type: "string",
      maxLength: 8192,
      enum: [
        "first-person",
        "second-person",
        "third-person",
        "mixed",
        "uncertain",
      ],
    },
  },
  required: ["passageId", "perspective"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label a caller-annotated narrator perspective without inferring it from prose. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { passageId, perspective } = request;
  const compute = (): Output => {
    H.domain(passageId.length > 0, "passageId");
    H.domain(
      [
        "first-person",
        "second-person",
        "third-person",
        "mixed",
        "uncertain",
      ].includes(perspective),
      "perspective",
    );
    return { tag: passageId + " [narrator perspective: " + perspective + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { passageId: "P17", perspective: "first-person" },
  output: { tag: "P17 [narrator perspective: first-person]" },
} satisfies ToolExample<Input, Output>;
export const narratorPerspectiveAnnotationTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "comparative-literature",
        "comparative literature",
        "humanities",
      ],
      keywords: ["comparative literature", "humanities"],
    },
    id: "comparative-literature/narrator-perspective-annotation-tag",
    title: "Narrator Perspective Annotation Tag",
    description:
      "Label a caller-annotated narrator perspective without inferring it from prose.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        passageId: { type: "string", maxLength: 8192, minLength: 1 },
        perspective: {
          type: "string",
          maxLength: 8192,
          enum: [
            "first-person",
            "second-person",
            "third-person",
            "mixed",
            "uncertain",
          ],
        },
      },
      required: ["passageId", "perspective"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "passageId",
          label: "Passage Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "perspective",
          label: "Perspective",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = narratorPerspectiveAnnotationTagTool.execute;
export default narratorPerspectiveAnnotationTagTool;
