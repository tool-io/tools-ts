import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly traitRecordId: string;
  readonly measurementBasis: string;
  readonly suppliedUnit: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    traitRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    measurementBasis: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["traitRecordId", "measurementBasis", "suppliedUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit trait-measurement basis and unit metadata without converting biological states. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { traitRecordId, measurementBasis, suppliedUnit } = request;
  const compute = (): Output => {
    H.domain(traitRecordId.length > 0, "traitRecordId");
    H.domain(measurementBasis.length > 0, "measurementBasis");
    H.domain(suppliedUnit.length > 0, "suppliedUnit");
    return {
      token: JSON.stringify([traitRecordId, measurementBasis, suppliedUnit]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    traitRecordId: "T17",
    measurementBasis: "dry mass",
    suppliedUnit: "mg",
  },
  output: { token: '["T17","dry mass","mg"]' },
} satisfies ToolExample<Input, Output>;
export const traitRecordMeasurementBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/trait-record-measurement-basis",
    title: "Trait Record Measurement Basis",
    description:
      "Preserve explicit trait-measurement basis and unit metadata without converting biological states.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        traitRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        measurementBasis: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedUnit: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["traitRecordId", "measurementBasis", "suppliedUnit"],
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
          id: "traitRecordId",
          label: "Trait Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "measurementBasis",
          label: "Measurement Basis",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedUnit",
          label: "Supplied Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = traitRecordMeasurementBasisTool.execute;
export default traitRecordMeasurementBasisTool;
