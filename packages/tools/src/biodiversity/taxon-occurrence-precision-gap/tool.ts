import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spatialRadii: readonly number[];
  readonly acceptedMaximum: number;
  readonly verified: readonly boolean[];
};
export type Output = {
  readonly verifiedRecords: number;
  readonly supportedPrecisionRecords: number;
  readonly unsupportedVerifiedRecords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spatialRadii: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    acceptedMaximum: { type: "number", minimum: 0 },
    verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["spatialRadii", "acceptedMaximum", "verified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    verifiedRecords: { type: "integer" },
    supportedPrecisionRecords: { type: "integer" },
    unsupportedVerifiedRecords: { type: "integer" },
  },
  required: [
    "verifiedRecords",
    "supportedPrecisionRecords",
    "unsupportedVerifiedRecords",
  ],
} as const;
/** Calculate taxon occurrence precision gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spatialRadii, acceptedMaximum, verified } = request;
  const compute = (): Output => {
    H.sameLength(spatialRadii, verified);
    H.domain(spatialRadii.every((x) => x >= 0) && acceptedMaximum >= 0);
    return {
      verifiedRecords: verified.filter(Boolean).length,
      supportedPrecisionRecords: verified.filter(
        (x, i) => x && spatialRadii[i] <= acceptedMaximum,
      ).length,
      unsupportedVerifiedRecords: verified.filter(
        (x, i) => x && spatialRadii[i] > acceptedMaximum,
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    spatialRadii: [10, 20, 5],
    acceptedMaximum: 15,
    verified: [true, true, false],
  },
  output: {
    verifiedRecords: 2,
    supportedPrecisionRecords: 1,
    unsupportedVerifiedRecords: 1,
  },
} satisfies ToolExample<Input, Output>;
export const taxonOccurrencePrecisionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/taxon-occurrence-precision-gap",
    title: "Taxon Occurrence Precision Gap Tool",
    description:
      "Calculate taxon occurrence precision gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spatialRadii: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        acceptedMaximum: { type: "number", minimum: 0 },
        verified: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["spatialRadii", "acceptedMaximum", "verified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        verifiedRecords: { type: "integer" },
        supportedPrecisionRecords: { type: "integer" },
        unsupportedVerifiedRecords: { type: "integer" },
      },
      required: [
        "verifiedRecords",
        "supportedPrecisionRecords",
        "unsupportedVerifiedRecords",
      ],
    },
    ports: {
      inputs: [
        {
          id: "spatialRadii",
          label: "Spatial Radii",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "acceptedMaximum",
          label: "Accepted Maximum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "verified",
          label: "Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "verifiedRecords",
          label: "Verified Records",
          valueType: { type: "integer" },
        },
        {
          id: "supportedPrecisionRecords",
          label: "Supported Precision Records",
          valueType: { type: "integer" },
        },
        {
          id: "unsupportedVerifiedRecords",
          label: "Unsupported Verified Records",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonOccurrencePrecisionGapTool.execute;
export default taxonOccurrencePrecisionGapTool;
