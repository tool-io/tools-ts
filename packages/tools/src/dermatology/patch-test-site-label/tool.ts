import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly panelCode: string;
  readonly rowCode: string;
  readonly columnNumber: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    panelCode: { type: "string", maxLength: 8192, minLength: 1 },
    rowCode: { type: "string", maxLength: 8192, minLength: 1 },
    columnNumber: { type: "integer", minimum: 1 },
  },
  required: ["panelCode", "rowCode", "columnNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicitly recorded patch-test panel site address without assigning allergens or interpreting a reaction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { panelCode, rowCode, columnNumber } = request;
  const compute = (): Output => {
    H.domain(panelCode.length > 0 && rowCode.length > 0, "panelCode");
    (H.domain(
      Number.isSafeInteger(columnNumber) &&
        columnNumber >= 1 &&
        columnNumber <= Number.MAX_SAFE_INTEGER,
      "columnNumber",
    ),
      columnNumber);
    return { label: panelCode + "/" + rowCode + columnNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { panelCode: "P17", rowCode: "B", columnNumber: 3 },
  output: { label: "P17/B3" },
} satisfies ToolExample<Input, Output>;
export const patchTestSiteLabelTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["dermatology", "health and medicine"],
      keywords: ["dermatology", "health and medicine"],
    },
    id: "dermatology/patch-test-site-label",
    title: "Patch Test Site Label",
    description:
      "Format an explicitly recorded patch-test panel site address without assigning allergens or interpreting a reaction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        panelCode: { type: "string", maxLength: 8192, minLength: 1 },
        rowCode: { type: "string", maxLength: 8192, minLength: 1 },
        columnNumber: { type: "integer", minimum: 1 },
      },
      required: ["panelCode", "rowCode", "columnNumber"],
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
          id: "panelCode",
          label: "Panel Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rowCode",
          label: "Row Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "columnNumber",
          label: "Column Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = patchTestSiteLabelTool.execute;
export default patchTestSiteLabelTool;
