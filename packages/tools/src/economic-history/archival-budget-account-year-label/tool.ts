import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly archiveReference: string;
  readonly accountTitle: string;
  readonly yearText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    archiveReference: { type: "string", maxLength: 8192, minLength: 1 },
    accountTitle: { type: "string", maxLength: 8192, minLength: 1 },
    yearText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["archiveReference", "accountTitle", "yearText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label a literal archival budget account and year transcription without inferring a fiscal calendar. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { archiveReference, accountTitle, yearText } = request;
  const compute = (): Output => {
    H.domain(
      archiveReference.length > 0 &&
        accountTitle.length > 0 &&
        yearText.length > 0,
      "archiveReference",
    );
    return {
      label: accountTitle + " [" + yearText + "; " + archiveReference + "]",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    archiveReference: "AR17",
    accountTitle: "Town account",
    yearText: "1750/51",
  },
  output: { label: "Town account [1750/51; AR17]" },
} satisfies ToolExample<Input, Output>;
export const archivalBudgetAccountYearLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["economic-history", "economic history", "economics"],
      keywords: ["economic history", "economics"],
    },
    id: "economic-history/archival-budget-account-year-label",
    title: "Archival Budget Account Year Label",
    description:
      "Label a literal archival budget account and year transcription without inferring a fiscal calendar.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        archiveReference: { type: "string", maxLength: 8192, minLength: 1 },
        accountTitle: { type: "string", maxLength: 8192, minLength: 1 },
        yearText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["archiveReference", "accountTitle", "yearText"],
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
          id: "archiveReference",
          label: "Archive Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "accountTitle",
          label: "Account Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "yearText",
          label: "Year Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = archivalBudgetAccountYearLabelTool.execute;
export default archivalBudgetAccountYearLabelTool;
