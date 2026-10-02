import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly phaseKnown: boolean;
  readonly firstAllele: string;
  readonly secondAllele: string;
};
export type Output = {
  readonly phaseStatus: string;
  readonly preservedAlleles: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseKnown: { type: "boolean" },
    firstAllele: { type: "string", maxLength: 8192 },
    secondAllele: { type: "string", maxLength: 8192 },
  },
  required: ["phaseKnown", "firstAllele", "secondAllele"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    phaseStatus: { type: "string", maxLength: 8192 },
    preservedAlleles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["phaseStatus", "preservedAlleles"],
} as const;
/** Preserve the supplied phase-known flag without inferring haplotypes from labels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { phaseKnown, firstAllele, secondAllele } = request;
  const compute = (): Output => {
    return {
      phaseStatus: phaseKnown ? "supplied-known" : "unknown",
      preservedAlleles: [firstAllele, secondAllele],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { phaseKnown: false, firstAllele: "*1", secondAllele: "*2" },
  output: { phaseStatus: "unknown", preservedAlleles: ["*1", "*2"] },
} satisfies ToolExample<Input, Output>;
export const pharmacogenePhaseUnknownTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/pharmacogene-phase-unknown-token",
    title: "Pharmacogene Phase Unknown Token Tool",
    description:
      "Preserve the supplied phase-known flag without inferring haplotypes from labels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseKnown: { type: "boolean" },
        firstAllele: { type: "string", maxLength: 8192 },
        secondAllele: { type: "string", maxLength: 8192 },
      },
      required: ["phaseKnown", "firstAllele", "secondAllele"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        phaseStatus: { type: "string", maxLength: 8192 },
        preservedAlleles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["phaseStatus", "preservedAlleles"],
    },
    ports: {
      inputs: [
        {
          id: "phaseKnown",
          label: "Phase Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "firstAllele",
          label: "First Allele",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondAllele",
          label: "Second Allele",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "phaseStatus",
          label: "Phase Status",
          valueType: { type: "string" },
        },
        {
          id: "preservedAlleles",
          label: "Preserved Alleles",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = pharmacogenePhaseUnknownTokenTool.execute;
export default pharmacogenePhaseUnknownTokenTool;
