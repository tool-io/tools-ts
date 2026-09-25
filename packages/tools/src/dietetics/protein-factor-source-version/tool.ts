import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredNitrogen: number;
  readonly suppliedFactor: number;
  readonly source: string;
  readonly version: string;
  readonly expectedVersion: string;
};
export type Output = {
  readonly calculatedProtein: number;
  readonly versionMatches: boolean;
  readonly provenance: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredNitrogen: { type: "number", minimum: 0 },
    suppliedFactor: { type: "number", exclusiveMinimum: 0 },
    source: { type: "string", maxLength: 8192 },
    version: { type: "string", maxLength: 8192 },
    expectedVersion: { type: "string", maxLength: 8192 },
  },
  required: [
    "measuredNitrogen",
    "suppliedFactor",
    "source",
    "version",
    "expectedVersion",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calculatedProtein: { type: "number" },
    versionMatches: { type: "boolean" },
    provenance: { type: "string", maxLength: 8192 },
  },
  required: ["calculatedProtein", "versionMatches", "provenance"],
} as const;
/** Apply an explicit nitrogen-to-protein factor with retained source/version; no food-specific factor is chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredNitrogen, suppliedFactor, source, version, expectedVersion } =
    request;
  const compute = (): Output => {
    H.domain(measuredNitrogen >= 0 && suppliedFactor > 0 && source.length > 0);
    return {
      calculatedProtein: measuredNitrogen * suppliedFactor,
      versionMatches: version === expectedVersion,
      provenance: JSON.stringify([source, version]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredNitrogen: 2,
    suppliedFactor: 6.25,
    source: "method-A",
    version: "v1",
    expectedVersion: "v1",
  },
  output: {
    calculatedProtein: 12.5,
    versionMatches: true,
    provenance: '["method-A","v1"]',
  },
} satisfies ToolExample<Input, Output>;
export const proteinFactorSourceVersionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/protein-factor-source-version",
    title: "Protein Factor Source Version Tool",
    description:
      "Apply an explicit nitrogen-to-protein factor with retained source/version; no food-specific factor is chosen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredNitrogen: { type: "number", minimum: 0 },
        suppliedFactor: { type: "number", exclusiveMinimum: 0 },
        source: { type: "string", maxLength: 8192 },
        version: { type: "string", maxLength: 8192 },
        expectedVersion: { type: "string", maxLength: 8192 },
      },
      required: [
        "measuredNitrogen",
        "suppliedFactor",
        "source",
        "version",
        "expectedVersion",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calculatedProtein: { type: "number" },
        versionMatches: { type: "boolean" },
        provenance: { type: "string", maxLength: 8192 },
      },
      required: ["calculatedProtein", "versionMatches", "provenance"],
    },
    ports: {
      inputs: [
        {
          id: "measuredNitrogen",
          label: "Measured Nitrogen",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFactor",
          label: "Supplied Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "source",
          label: "Source",
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
        {
          id: "calculatedProtein",
          label: "Calculated Protein",
          valueType: { type: "number" },
        },
        {
          id: "versionMatches",
          label: "Version Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "provenance",
          label: "Provenance",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = proteinFactorSourceVersionTool.execute;
export default proteinFactorSourceVersionTool;
