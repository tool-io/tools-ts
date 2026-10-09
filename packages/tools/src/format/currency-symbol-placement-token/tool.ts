import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amountText: string;
  readonly currencySymbol: string;
  readonly symbolAfter: boolean;
  readonly insertSpace: boolean;
};
export type Output = { readonly formatted: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amountText: { type: "string", maxLength: 8192, minLength: 1 },
    currencySymbol: { type: "string", maxLength: 8192, minLength: 1 },
    symbolAfter: { type: "boolean" },
    insertSpace: { type: "boolean" },
  },
  required: ["amountText", "currencySymbol", "symbolAfter", "insertSpace"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { formatted: { type: "string", maxLength: 8192 } },
  required: ["formatted"],
} as const;
/** Place an explicit currency symbol before or after unchanged amount text with a caller-selected spacing policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amountText, currencySymbol, symbolAfter, insertSpace } = request;
  const compute = (): Output => {
    H.domain(amountText.length > 0 && currencySymbol.length > 0, "amountText");
    return {
      formatted: symbolAfter
        ? amountText + (insertSpace ? " " : "") + currencySymbol
        : currencySymbol + (insertSpace ? " " : "") + amountText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    amountText: "12.50",
    currencySymbol: "$",
    symbolAfter: false,
    insertSpace: false,
  },
  output: { formatted: "$12.50" },
} satisfies ToolExample<Input, Output>;
export const currencySymbolPlacementTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["encode-decode"],
      fields: ["format", "data formatting", "computer science"],
      keywords: ["data formatting", "computer science"],
    },
    id: "format/currency-symbol-placement-token",
    title: "Currency Symbol Placement Token",
    description:
      "Place an explicit currency symbol before or after unchanged amount text with a caller-selected spacing policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amountText: { type: "string", maxLength: 8192, minLength: 1 },
        currencySymbol: { type: "string", maxLength: 8192, minLength: 1 },
        symbolAfter: { type: "boolean" },
        insertSpace: { type: "boolean" },
      },
      required: ["amountText", "currencySymbol", "symbolAfter", "insertSpace"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { formatted: { type: "string", maxLength: 8192 } },
      required: ["formatted"],
    },
    ports: {
      inputs: [
        {
          id: "amountText",
          label: "Amount Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currencySymbol",
          label: "Currency Symbol",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "symbolAfter",
          label: "Symbol After",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "insertSpace",
          label: "Insert Space",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "formatted", label: "Formatted", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = currencySymbolPlacementTokenTool.execute;
export default currencySymbolPlacementTokenTool;
