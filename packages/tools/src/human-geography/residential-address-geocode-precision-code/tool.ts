import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly suppliedPrecision: string;
  readonly sourceMethod: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedPrecision: { type: "string", maxLength: 8192, minLength: 1 },
    sourceMethod: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "suppliedPrecision", "sourceMethod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicit residential geocoding precision assertion without addresses, coordinate inference or privacy guarantees. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, suppliedPrecision, sourceMethod } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(suppliedPrecision.length > 0, "suppliedPrecision");
    H.domain(sourceMethod.length > 0, "sourceMethod");
    return {
      token: JSON.stringify([recordId, suppliedPrecision, sourceMethod]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    suppliedPrecision: "street centroid",
    sourceMethod: "method M4",
  },
  output: { token: '["R17","street centroid","method M4"]' },
} satisfies ToolExample<Input, Output>;
export const residentialAddressGeocodePrecisionCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "human-geography/residential-address-geocode-precision-code",
      title: "Residential Address Geocode Precision Code Tool",
      description:
        "Record an explicit residential geocoding precision assertion without addresses, coordinate inference or privacy guarantees.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedPrecision: { type: "string", maxLength: 8192, minLength: 1 },
          sourceMethod: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["recordId", "suppliedPrecision", "sourceMethod"],
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
            id: "suppliedPrecision",
            label: "Supplied Precision",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "sourceMethod",
            label: "Source Method",
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
export const run = residentialAddressGeocodePrecisionCodeTool.execute;
export default residentialAddressGeocodePrecisionCodeTool;
