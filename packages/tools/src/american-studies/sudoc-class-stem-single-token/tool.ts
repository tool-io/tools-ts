import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly classNumber: string };
export type Output = { readonly stem: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { classNumber: { type: "string", maxLength: 8192 } },
  required: ["classNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { stem: { type: "string", maxLength: 8192 } },
  required: ["stem"],
} as const;
/** Extract the pre-colon agency/class stem of a SuDocs-shaped classification string; no agency schedule or full classification validity is checked. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { classNumber } = request;
  const compute = (): Output => {
    const index = classNumber.indexOf(":");
    H.domain(index > 0, "classNumber");
    const stem = classNumber.slice(0, index);
    H.domain(/^[A-Z][A-Z0-9 .\/-]*(?![\s\S])/.test(stem), "classNumber");
    return { stem };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { classNumber: "Y 4.G 74/7:112-3" },
  output: { stem: "Y 4.G 74/7" },
} satisfies ToolExample<Input, Output>;
export const sudocClassStemSingleTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "american-studies/sudoc-class-stem-single-token",
    title: "Sudoc Class Stem Single Token Tool",
    description:
      "Extract the pre-colon agency/class stem of a SuDocs-shaped classification string; no agency schedule or full classification validity is checked.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { classNumber: { type: "string", maxLength: 8192 } },
      required: ["classNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { stem: { type: "string", maxLength: 8192 } },
      required: ["stem"],
    },
    ports: {
      inputs: [
        {
          id: "classNumber",
          label: "Class Number",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "stem", label: "Stem", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = sudocClassStemSingleTokenTool.execute;
export default sudocClassStemSingleTokenTool;
