import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly title: string; readonly juanNumber: number };
export type Output = { readonly reference: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", maxLength: 8192 },
    juanNumber: { type: "integer", minimum: 1 },
  },
  required: ["title", "juanNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
/** Format an explicit Chinese-book title and juan number without resolving edition-specific contents. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { title, juanNumber } = request;
  const compute = (): Output => {
    H.domain(title.length > 0, "title");
    (H.domain(
      Number.isSafeInteger(juanNumber) &&
        juanNumber >= 1 &&
        juanNumber <= Number.MAX_SAFE_INTEGER,
      "juanNumber",
    ),
      juanNumber);
    return { reference: title + " 卷" + juanNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { title: "書名", juanNumber: 12 },
  output: { reference: "書名 卷12" },
} satisfies ToolExample<Input, Output>;
export const chineseBookJuanReferenceTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "asian-studies/chinese-book-juan-reference-token",
    title: "Chinese Book Juan Reference Token Tool",
    description:
      "Format an explicit Chinese-book title and juan number without resolving edition-specific contents.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string", maxLength: 8192 },
        juanNumber: { type: "integer", minimum: 1 },
      },
      required: ["title", "juanNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reference: { type: "string", maxLength: 8192 } },
      required: ["reference"],
    },
    ports: {
      inputs: [
        {
          id: "title",
          label: "Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "juanNumber",
          label: "Juan Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = chineseBookJuanReferenceTokenTool.execute;
export default chineseBookJuanReferenceTokenTool;
