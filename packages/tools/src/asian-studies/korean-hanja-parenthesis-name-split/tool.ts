import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly nameText: string };
export type Output = {
  readonly hangulName: string;
  readonly hanjaAnnotation: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nameText: { type: "string", maxLength: 8192 } },
  required: ["nameText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hangulName: { type: "string", maxLength: 8192 },
    hanjaAnnotation: { type: "string", maxLength: 8192 },
  },
  required: ["hangulName", "hanjaAnnotation"],
} as const;
/** Split an explicit display name and parenthesized Hanja annotation without validating name identity or script content. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nameText } = request;
  const compute = (): Output => {
    const match = /^([^()]+)\(([^()]+)\)(?![\s\S])/.exec(nameText);
    H.domain(match, "nameText");
    return { hangulName: match[1].trim(), hanjaAnnotation: match[2] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nameText: "김민수(金民秀)" },
  output: { hangulName: "김민수", hanjaAnnotation: "金民秀" },
} satisfies ToolExample<Input, Output>;
export const koreanHanjaParenthesisNameSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/korean-hanja-parenthesis-name-split",
    title: "Korean Hanja Parenthesis Name Split Tool",
    description:
      "Split an explicit display name and parenthesized Hanja annotation without validating name identity or script content.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nameText: { type: "string", maxLength: 8192 } },
      required: ["nameText"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        hangulName: { type: "string", maxLength: 8192 },
        hanjaAnnotation: { type: "string", maxLength: 8192 },
      },
      required: ["hangulName", "hanjaAnnotation"],
    },
    ports: {
      inputs: [
        {
          id: "nameText",
          label: "Name Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "hangulName",
          label: "Hangul Name",
          valueType: { type: "string" },
        },
        {
          id: "hanjaAnnotation",
          label: "Hanja Annotation",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = koreanHanjaParenthesisNameSplitTool.execute;
export default koreanHanjaParenthesisNameSplitTool;
