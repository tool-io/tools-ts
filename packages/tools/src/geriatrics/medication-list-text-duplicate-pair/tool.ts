import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstText: string;
  readonly secondText: string;
  readonly ignoreCase: boolean;
};
export type Output = { readonly sameLiteralText: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstText: { type: "string", maxLength: 8192, minLength: 1 },
    secondText: { type: "string", maxLength: 8192, minLength: 1 },
    ignoreCase: { type: "boolean" },
  },
  required: ["firstText", "secondText", "ignoreCase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { sameLiteralText: { type: "boolean" } },
  required: ["sameLiteralText"],
} as const;
/** Compare complete medication-list text fields literally without inferring drug equivalence or duplicate therapy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstText, secondText, ignoreCase } = request;
  const compute = (): Output => {
    H.domain(firstText.length > 0 && secondText.length > 0, "firstText");
    return {
      sameLiteralText: ignoreCase
        ? firstText.toLowerCase() === secondText.toLowerCase()
        : firstText === secondText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstText: "Drug A 5 mg",
    secondText: "drug a 5 mg",
    ignoreCase: true,
  },
  output: { sameLiteralText: true },
} satisfies ToolExample<Input, Output>;
export const medicationListTextDuplicatePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["geriatrics", "health and medicine"],
      keywords: ["geriatrics", "health and medicine"],
    },
    id: "geriatrics/medication-list-text-duplicate-pair",
    title: "Medication List Text Duplicate Pair",
    description:
      "Compare complete medication-list text fields literally without inferring drug equivalence or duplicate therapy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstText: { type: "string", maxLength: 8192, minLength: 1 },
        secondText: { type: "string", maxLength: 8192, minLength: 1 },
        ignoreCase: { type: "boolean" },
      },
      required: ["firstText", "secondText", "ignoreCase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { sameLiteralText: { type: "boolean" } },
      required: ["sameLiteralText"],
    },
    ports: {
      inputs: [
        {
          id: "firstText",
          label: "First Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondText",
          label: "Second Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "ignoreCase",
          label: "Ignore Case",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "sameLiteralText",
          label: "Same Literal Text",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = medicationListTextDuplicatePairTool.execute;
export default medicationListTextDuplicatePairTool;
