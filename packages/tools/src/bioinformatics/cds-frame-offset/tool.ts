import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly basesBeforeFeature: number };
export type Output = {
  readonly codonOffsetZeroBased: number;
  readonly basesToNextBoundary: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { basesBeforeFeature: { type: "integer", minimum: 0 } },
  required: ["basesBeforeFeature"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codonOffsetZeroBased: { type: "integer" },
    basesToNextBoundary: { type: "integer" },
  },
  required: ["codonOffsetZeroBased", "basesToNextBoundary"],
} as const;
/** Compute zero-based codon offset from an explicit spliced-CDS base count, distinct from a GFF phase field. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { basesBeforeFeature } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(basesBeforeFeature) &&
        basesBeforeFeature >= 0 &&
        basesBeforeFeature <= Number.MAX_SAFE_INTEGER,
      "basesBeforeFeature",
    ),
      basesBeforeFeature);
    return {
      codonOffsetZeroBased: basesBeforeFeature % 3,
      basesToNextBoundary: (3 - (basesBeforeFeature % 3)) % 3,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { basesBeforeFeature: 7 },
  output: { codonOffsetZeroBased: 1, basesToNextBoundary: 2 },
} satisfies ToolExample<Input, Output>;
export const cdsFrameOffsetTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioinformatics", "biology"],
      keywords: ["bioinformatics", "biology"],
    },
    id: "bioinformatics/cds-frame-offset",
    title: "CDS Frame Offset",
    description:
      "Compute zero-based codon offset from an explicit spliced-CDS base count, distinct from a GFF phase field.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { basesBeforeFeature: { type: "integer", minimum: 0 } },
      required: ["basesBeforeFeature"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        codonOffsetZeroBased: { type: "integer" },
        basesToNextBoundary: { type: "integer" },
      },
      required: ["codonOffsetZeroBased", "basesToNextBoundary"],
    },
    ports: {
      inputs: [
        {
          id: "basesBeforeFeature",
          label: "Bases Before Feature",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "codonOffsetZeroBased",
          label: "Codon Offset Zero Based",
          valueType: { type: "integer" },
        },
        {
          id: "basesToNextBoundary",
          label: "Bases To Next Boundary",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = cdsFrameOffsetTool.execute;
export default cdsFrameOffsetTool;
