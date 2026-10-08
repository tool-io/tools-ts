import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly caseReference: string;
  readonly exhibitCode: string;
  readonly itemNumber: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    caseReference: { type: "string", maxLength: 8192, minLength: 1 },
    exhibitCode: { type: "string", maxLength: 8192, minLength: 1 },
    itemNumber: { type: "integer", minimum: 1 },
  },
  required: ["caseReference", "exhibitCode", "itemNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicit case/exhibit/item reference without asserting evidence authenticity or custody. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { caseReference, exhibitCode, itemNumber } = request;
  const compute = (): Output => {
    H.domain(
      caseReference.length > 0 && exhibitCode.length > 0,
      "caseReference",
    );
    (H.domain(
      Number.isSafeInteger(itemNumber) &&
        itemNumber >= 1 &&
        itemNumber <= Number.MAX_SAFE_INTEGER,
      "itemNumber",
    ),
      itemNumber);
    return { label: caseReference + " — " + exhibitCode + "-" + itemNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { caseReference: "CASE17", exhibitCode: "EX", itemNumber: 3 },
  output: { label: "CASE17 — EX-3" },
} satisfies ToolExample<Input, Output>;
export const caseExhibitLabelTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["criminal-justice", "criminal justice", "social sciences"],
      keywords: ["criminal justice", "social sciences"],
    },
    id: "criminal-justice/case-exhibit-label-token",
    title: "Case Exhibit Label Token",
    description:
      "Format an explicit case/exhibit/item reference without asserting evidence authenticity or custody.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        caseReference: { type: "string", maxLength: 8192, minLength: 1 },
        exhibitCode: { type: "string", maxLength: 8192, minLength: 1 },
        itemNumber: { type: "integer", minimum: 1 },
      },
      required: ["caseReference", "exhibitCode", "itemNumber"],
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
          id: "caseReference",
          label: "Case Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "exhibitCode",
          label: "Exhibit Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "itemNumber",
          label: "Item Number",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = caseExhibitLabelTokenTool.execute;
export default caseExhibitLabelTokenTool;
