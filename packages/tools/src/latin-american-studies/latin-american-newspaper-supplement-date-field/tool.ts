import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly newspaperTitle: string;
  readonly supplementTitle: string;
  readonly dateText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newspaperTitle: { type: "string", maxLength: 8192 },
    supplementTitle: { type: "string", maxLength: 8192 },
    dateText: { type: "string", maxLength: 8192 },
  },
  required: ["newspaperTitle", "supplementTitle", "dateText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label literal newspaper, supplement and date fields without normalizing historical chronology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { newspaperTitle, supplementTitle, dateText } = request;
  const compute = (): Output => {
    H.domain(
      newspaperTitle.length > 0 &&
        supplementTitle.length > 0 &&
        dateText.length > 0,
      "newspaperTitle",
    );
    return {
      label: newspaperTitle + " — " + supplementTitle + ", " + dateText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    newspaperTitle: "Diario A",
    supplementTitle: "Cultura",
    dateText: "1920-05-01",
  },
  output: { label: "Diario A — Cultura, 1920-05-01" },
} satisfies ToolExample<Input, Output>;
export const latinAmericanNewspaperSupplementDateFieldTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "latin-american-studies/latin-american-newspaper-supplement-date-field",
      title: "Latin American Newspaper Supplement Date Field Tool",
      description:
        "Label literal newspaper, supplement and date fields without normalizing historical chronology.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          newspaperTitle: { type: "string", maxLength: 8192 },
          supplementTitle: { type: "string", maxLength: 8192 },
          dateText: { type: "string", maxLength: 8192 },
        },
        required: ["newspaperTitle", "supplementTitle", "dateText"],
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
            id: "newspaperTitle",
            label: "Newspaper Title",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "supplementTitle",
            label: "Supplement Title",
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
export const run = latinAmericanNewspaperSupplementDateFieldTool.execute;
export default latinAmericanNewspaperSupplementDateFieldTool;
