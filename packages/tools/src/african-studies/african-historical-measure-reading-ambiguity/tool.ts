import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedReading: string;
  readonly ambiguityWording: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedReading: { type: "string", maxLength: 8192, minLength: 1 },
    ambiguityWording: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedReading", "ambiguityWording"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit historical measure wording and ambiguity without converting uncertain units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedReading, ambiguityWording } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedReading.length > 0, "suppliedReading");
    H.domain(ambiguityWording.length > 0, "ambiguityWording");
    return {
      token: JSON.stringify([recordId, suppliedReading, ambiguityWording]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedReading: "12 units",
    ambiguityWording: "unit unresolved",
  },
  output: { token: '["R17","12 units","unit unresolved"]' },
} satisfies ToolExample<Input, Output>;
export const africanHistoricalMeasureReadingAmbiguityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["african-studies", "african studies", "humanities"],
        keywords: ["african studies", "humanities"],
      },
      id: "african-studies/african-historical-measure-reading-ambiguity",
      title: "African Historical Measure Reading Ambiguity",
      description:
        "Preserve explicit historical measure wording and ambiguity without converting uncertain units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedReading: { type: "string", maxLength: 8192, minLength: 1 },
          ambiguityWording: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedReading", "ambiguityWording"],
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
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedReading",
            label: "Supplied Reading",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "ambiguityWording",
            label: "Ambiguity Wording",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = africanHistoricalMeasureReadingAmbiguityTool.execute;
export default africanHistoricalMeasureReadingAmbiguityTool;
