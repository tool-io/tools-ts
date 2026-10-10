import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arrayId: string;
  readonly rowLabel: string;
  readonly columnNumber: number;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arrayId: { type: "string", maxLength: 8192, minLength: 1 },
    rowLabel: { type: "string", maxLength: 8192 },
    columnNumber: { type: "integer", minimum: 1 },
  },
  required: ["arrayId", "rowLabel", "columnNumber"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Format an explicitly supplied tissue-array row label and one-based column without assigning a physical array orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arrayId, rowLabel, columnNumber } = request;
  const compute = (): Output => {
    H.domain(arrayId.length > 0, "arrayId");
    H.domain(/^[A-Z]+(?![\s\S])/.test(rowLabel), "rowLabel");
    (H.domain(
      Number.isSafeInteger(columnNumber) &&
        columnNumber >= 1 &&
        columnNumber <= Number.MAX_SAFE_INTEGER,
      "columnNumber",
    ),
      columnNumber);
    return { token: arrayId + ":" + rowLabel + columnNumber };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { arrayId: "TMA17", rowLabel: "B", columnNumber: 3 },
  output: { token: "TMA17:B3" },
} satisfies ToolExample<Input, Output>;
export const tissueCoreArrayPositionTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["histology", "biology"],
      keywords: ["histology", "biology"],
    },
    id: "histology/tissue-core-array-position-token",
    title: "Tissue Core Array Position Token",
    description:
      "Format an explicitly supplied tissue-array row label and one-based column without assigning a physical array orientation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        arrayId: { type: "string", maxLength: 8192, minLength: 1 },
        rowLabel: { type: "string", maxLength: 8192 },
        columnNumber: { type: "integer", minimum: 1 },
      },
      required: ["arrayId", "rowLabel", "columnNumber"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "arrayId",
          label: "Array Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "rowLabel",
          label: "Row Label",
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
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = tissueCoreArrayPositionTokenTool.execute;
export default tissueCoreArrayPositionTokenTool;
