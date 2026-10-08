import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly institutionCode: string;
  readonly categoryWording: string;
  readonly dateText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    institutionCode: { type: "string", maxLength: 8192, minLength: 1 },
    categoryWording: { type: "string", maxLength: 8192, minLength: 1 },
    dateText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["institutionCode", "categoryWording", "dateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Attach explicit historical date context to a supplied institutional category without treating it as a current classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { institutionCode, categoryWording, dateText } = request;
  const compute = (): Output => {
    H.domain(
      institutionCode.length > 0 &&
        categoryWording.length > 0 &&
        dateText.length > 0,
      "institutionCode",
    );
    return {
      label: institutionCode + " [" + categoryWording + "; " + dateText + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    institutionCode: "I17",
    categoryWording: "recorded category",
    dateText: "c. 1900",
  },
  output: { label: "I17 [recorded category; c. 1900]" },
} satisfies ToolExample<Input, Output>;
export const institutionCategoryHistoricalDateLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["critical-theory", "critical theory", "humanities"],
        keywords: ["critical theory", "humanities"],
      },
      id: "critical-theory/institution-category-historical-date-label",
      title: "Institution Category Historical Date Label",
      description:
        "Attach explicit historical date context to a supplied institutional category without treating it as a current classification.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          institutionCode: { type: "string", maxLength: 8192, minLength: 1 },
          categoryWording: { type: "string", maxLength: 8192, minLength: 1 },
          dateText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["institutionCode", "categoryWording", "dateText"],
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
            id: "institutionCode",
            label: "Institution Code",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "categoryWording",
            label: "Category Wording",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "dateText",
            label: "Date Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = institutionCategoryHistoricalDateLabelTool.execute;
export default institutionCategoryHistoricalDateLabelTool;
