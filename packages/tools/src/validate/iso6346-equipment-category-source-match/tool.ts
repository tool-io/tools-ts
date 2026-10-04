import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly code: string;
  readonly expectedCategory: string;
};
export type Output = { readonly matches: boolean; readonly category: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    code: { type: "string", maxLength: 8192 },
    expectedCategory: { type: "string", maxLength: 8192 },
  },
  required: ["code", "expectedCategory"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    category: { type: "string", maxLength: 8192 },
  },
  required: ["matches", "category"],
} as const;
/** Compute iso 6346 equipment category source match from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { code, expectedCategory } = input;
  const compute = (): Output => {
    domain(
      /^[A-Z]{3}[UJZ]\d{7}(?![\s\S])/.test(code) &&
        /^[UJZ](?![\s\S])/.test(expectedCategory),
    );
    return { matches: code[3] === expectedCategory, category: code[3] };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { code: "CSQU3054383", expectedCategory: "U" },
  output: { matches: true, category: "U" },
} satisfies ToolExample<Input, Output>;
export const iso6346EquipmentCategorySourceMatchTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "validate/iso6346-equipment-category-source-match",
  title: "ISO 6346 Equipment Category Source Match Tool",
  description:
    "Compute iso 6346 equipment category source match from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "code",
        label: "Code",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "expectedCategory",
        label: "Expected Category",
        required: true,
        valueType: { type: "string" },
      },
    ],
    outputs: [
      { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      { id: "category", label: "Category", valueType: { type: "string" } },
    ],
  },
});
export const run = iso6346EquipmentCategorySourceMatchTool.execute;
export default iso6346EquipmentCategorySourceMatchTool;
