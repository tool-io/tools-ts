import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly poemTitle: string;
  readonly baytNumber: number;
  readonly hemistich: string;
};
export type Output = { readonly reference: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    poemTitle: { type: "string", maxLength: 8192 },
    baytNumber: { type: "integer", minimum: 1 },
    hemistich: {
      type: "string",
      maxLength: 8192,
      enum: ["whole", "first", "second"],
    },
  },
  required: ["poemTitle", "baytNumber", "hemistich"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reference: { type: "string", maxLength: 8192 } },
  required: ["reference"],
} as const;
/** Format an explicit poem, bayt and optional hemistich locator without resolving edition-specific numbering. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { poemTitle, baytNumber, hemistich } = request;
  const compute = (): Output => {
    H.domain(poemTitle.length > 0, "poemTitle");
    (H.domain(
      Number.isSafeInteger(baytNumber) &&
        baytNumber >= 1 &&
        baytNumber <= Number.MAX_SAFE_INTEGER,
      "baytNumber",
    ),
      baytNumber);
    H.domain(["whole", "first", "second"].includes(hemistich), "hemistich");
    return {
      reference:
        poemTitle +
        ", bayt " +
        baytNumber +
        (hemistich === "whole" ? "" : " (" + hemistich + " hemistich)"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { poemTitle: "Poem A", baytNumber: 12, hemistich: "second" },
  output: { reference: "Poem A, bayt 12 (second hemistich)" },
} satisfies ToolExample<Input, Output>;
export const persianPoemBaytReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "middle-eastern-studies/persian-poem-bayt-reference",
    title: "Persian Poem Bayt Reference Tool",
    description:
      "Format an explicit poem, bayt and optional hemistich locator without resolving edition-specific numbering.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        poemTitle: { type: "string", maxLength: 8192 },
        baytNumber: { type: "integer", minimum: 1 },
        hemistich: {
          type: "string",
          maxLength: 8192,
          enum: ["whole", "first", "second"],
        },
      },
      required: ["poemTitle", "baytNumber", "hemistich"],
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
          id: "poemTitle",
          label: "Poem Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "baytNumber",
          label: "Bayt Number",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "hemistich",
          label: "Hemistich",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "reference", label: "Reference", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = persianPoemBaytReferenceTool.execute;
export default persianPoemBaytReferenceTool;
