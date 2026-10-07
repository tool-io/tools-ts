import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedYear: number;
  readonly uncertaintyWording: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedYear: { type: "integer" },
    uncertaintyWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedYear", "uncertaintyWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Preserve an explicit publication-year integer and uncertainty wording without inferring priority or chronology. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedYear, uncertaintyWording } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0 && uncertaintyWording.length > 0, "recordId");
    (H.domain(
      Number.isSafeInteger(suppliedYear) &&
        suppliedYear >= -Number.MAX_SAFE_INTEGER &&
        suppliedYear <= Number.MAX_SAFE_INTEGER,
      "suppliedYear",
    ),
      suppliedYear);
    return {
      label: recordId + "; year=" + suppliedYear + "; " + uncertaintyWording,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "PUB17",
    suppliedYear: 1820,
    uncertaintyWording: "as printed",
  },
  output: { label: "PUB17; year=1820; as printed" },
} satisfies ToolExample<Input, Output>;
export const taxonomicPublicationYearFieldTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biosystematics", "biology"],
      keywords: ["biosystematics", "biology"],
    },
    id: "biosystematics/taxonomic-publication-year-field",
    title: "Taxonomic Publication Year Field",
    description:
      "Preserve an explicit publication-year integer and uncertainty wording without inferring priority or chronology.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedYear: { type: "integer" },
        uncertaintyWording: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["recordId", "suppliedYear", "uncertaintyWording"],
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
          id: "recordId",
          label: "Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedYear",
          label: "Supplied Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "uncertaintyWording",
          label: "Uncertainty Wording",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = taxonomicPublicationYearFieldTool.execute;
export default taxonomicPublicationYearFieldTool;
