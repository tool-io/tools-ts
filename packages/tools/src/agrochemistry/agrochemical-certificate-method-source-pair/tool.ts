import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly method: string;
  readonly expectedMethod: string;
  readonly source: string;
  readonly expectedSource: string;
  readonly version: string;
  readonly expectedVersion: string;
};
export type Output = { readonly matches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    method: { type: "string", maxLength: 8192 },
    expectedMethod: { type: "string", maxLength: 8192 },
    source: { type: "string", maxLength: 8192 },
    expectedSource: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
    expectedVersion: { type: "string", maxLength: 8192 },
  },
  required: [
    "method",
    "expectedMethod",
    "source",
    "expectedSource",
    "version",
    "expectedVersion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" } },
  required: ["matches"],
} as const;
/** Compare supplied certificate method, source and edition fields. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    method,
    expectedMethod,
    source,
    expectedSource,
    version,
    expectedVersion,
  } = request;
  const compute = (): Output => {
    return {
      matches:
        method === expectedMethod &&
        source === expectedSource &&
        version === expectedVersion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    method: "M1",
    expectedMethod: "M1",
    source: "lab-A",
    expectedSource: "lab-A",
    version: "v2",
    expectedVersion: "v2",
  },
  output: { matches: true },
} satisfies ToolExample<Input, Output>;
export const agrochemicalCertificateMethodSourcePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrochemistry/agrochemical-certificate-method-source-pair",
      title: "Agrochemical Certificate Method Source Pair Tool",
      description:
        "Compare supplied certificate method, source and edition fields.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          method: { type: "string", maxLength: 8192 },
          expectedMethod: { type: "string", maxLength: 8192 },
          source: { type: "string", maxLength: 8192 },
          expectedSource: { type: "string", maxLength: 8192 },
          version: { type: "string", maxLength: 8192 },
          expectedVersion: { type: "string", maxLength: 8192 },
        },
        required: [
          "method",
          "expectedMethod",
          "source",
          "expectedSource",
          "version",
          "expectedVersion",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { matches: { type: "boolean" } },
        required: ["matches"],
      },
      ports: {
        inputs: [
          {
            id: "method",
            label: "Method",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedMethod",
            label: "Expected Method",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "source",
            label: "Source",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedSource",
            label: "Expected Source",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "version",
            label: "Version",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedVersion",
            label: "Expected Version",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = agrochemicalCertificateMethodSourcePairTool.execute;
export default agrochemicalCertificateMethodSourcePairTool;
