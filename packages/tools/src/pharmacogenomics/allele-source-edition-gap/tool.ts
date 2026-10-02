import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alleleIds: readonly string[];
  readonly recordedEditions: readonly string[];
  readonly requiredEdition: string;
  readonly verifiedAlleles: readonly string[];
};
export type Output = {
  readonly editionMismatches: number;
  readonly unverifiedAlleles: number;
  readonly fullySupported: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alleleIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recordedEditions: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requiredEdition: { type: "string", maxLength: 8192 },
    verifiedAlleles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: [
    "alleleIds",
    "recordedEditions",
    "requiredEdition",
    "verifiedAlleles",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    editionMismatches: { type: "integer" },
    unverifiedAlleles: { type: "integer" },
    fullySupported: { type: "integer" },
  },
  required: ["editionMismatches", "unverifiedAlleles", "fullySupported"],
} as const;
/** Calculate allele source edition gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alleleIds, recordedEditions, requiredEdition, verifiedAlleles } =
    request;
  const compute = (): Output => {
    H.sameLength(alleleIds, recordedEditions);
    return {
      editionMismatches: recordedEditions.filter((x) => x !== requiredEdition)
        .length,
      unverifiedAlleles: alleleIds.filter((x) => !verifiedAlleles.includes(x))
        .length,
      fullySupported: alleleIds.filter(
        (x, i) =>
          recordedEditions[i] === requiredEdition &&
          verifiedAlleles.includes(x),
      ).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    alleleIds: ["a", "b"],
    recordedEditions: ["v2", "v1"],
    requiredEdition: "v2",
    verifiedAlleles: ["a"],
  },
  output: { editionMismatches: 1, unverifiedAlleles: 1, fullySupported: 1 },
} satisfies ToolExample<Input, Output>;
export const alleleSourceEditionGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/allele-source-edition-gap",
    title: "Allele Source Edition Gap Tool",
    description:
      "Calculate allele source edition gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alleleIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recordedEditions: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        requiredEdition: { type: "string", maxLength: 8192 },
        verifiedAlleles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: [
        "alleleIds",
        "recordedEditions",
        "requiredEdition",
        "verifiedAlleles",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        editionMismatches: { type: "integer" },
        unverifiedAlleles: { type: "integer" },
        fullySupported: { type: "integer" },
      },
      required: ["editionMismatches", "unverifiedAlleles", "fullySupported"],
    },
    ports: {
      inputs: [
        {
          id: "alleleIds",
          label: "Allele Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "recordedEditions",
          label: "Recorded Editions",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "requiredEdition",
          label: "Required Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "verifiedAlleles",
          label: "Verified Alleles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "editionMismatches",
          label: "Edition Mismatches",
          valueType: { type: "integer" },
        },
        {
          id: "unverifiedAlleles",
          label: "Unverified Alleles",
          valueType: { type: "integer" },
        },
        {
          id: "fullySupported",
          label: "Fully Supported",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = alleleSourceEditionGapTool.execute;
export default alleleSourceEditionGapTool;
