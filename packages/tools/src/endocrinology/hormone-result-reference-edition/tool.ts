import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultCode: string;
  readonly referenceName: string;
  readonly edition: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultCode: { type: "string", maxLength: 8192, minLength: 1 },
    referenceName: { type: "string", maxLength: 8192, minLength: 1 },
    edition: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultCode", "referenceName", "edition"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach an explicit reference-source edition to a hormone result without selecting a reference interval or interpreting the result. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultCode, referenceName, edition } = request;
  const compute = (): Output => {
    H.domain(
      resultCode.length > 0 && referenceName.length > 0 && edition.length > 0,
      "resultCode",
    );
    return {
      label:
        resultCode +
        " [reference=" +
        referenceName +
        "; edition=" +
        edition +
        "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultCode: "R17",
    referenceName: "local laboratory interval",
    edition: "2026",
  },
  output: { label: "R17 [reference=local laboratory interval; edition=2026]" },
} satisfies ToolExample<Input, Output>;
export const hormoneResultReferenceEditionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["endocrinology", "health and medicine"],
      keywords: ["endocrinology", "health and medicine"],
    },
    id: "endocrinology/hormone-result-reference-edition",
    title: "Hormone Result Reference Edition",
    description:
      "Attach an explicit reference-source edition to a hormone result without selecting a reference interval or interpreting the result.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultCode: { type: "string", maxLength: 8192, minLength: 1 },
        referenceName: { type: "string", maxLength: 8192, minLength: 1 },
        edition: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultCode", "referenceName", "edition"],
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
          id: "resultCode",
          label: "Result Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referenceName",
          label: "Reference Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "edition",
          label: "Edition",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = hormoneResultReferenceEditionTool.execute;
export default hormoneResultReferenceEditionTool;
