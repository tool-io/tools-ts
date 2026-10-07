import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly accessionToken: string };
export type Output = {
  readonly accession: string;
  readonly versionText: string;
  readonly hasNumericVersion: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accessionToken: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["accessionToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accession: { type: "string", maxLength: 8192 },
    versionText: { type: "string", maxLength: 8192 },
    hasNumericVersion: { type: "boolean" },
  },
  required: ["accession", "versionText", "hasNumericVersion"],
} as const;
/** Split a final dot plus numeric accession version from supplied FASTA identifier text without validating an accession registry. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accessionToken } = request;
  const compute = (): Output => {
    H.domain(
      accessionToken.length > 0 && !/\s/.test(accessionToken),
      "accessionToken",
    );
    return (() => {
      const match = /^(.+)[.]([0-9]+)(?![\s\S])/.exec(accessionToken);
      return {
        accession: match ? match[1] : accessionToken,
        versionText: match ? match[2] : "",
        hasNumericVersion: match !== null,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { accessionToken: "AB123456.2" },
  output: { accession: "AB123456", versionText: "2", hasNumericVersion: true },
} satisfies ToolExample<Input, Output>;
export const fastaAccessionVersionSuffixTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["bioinformatics", "biology"],
      keywords: ["bioinformatics", "biology"],
    },
    id: "bioinformatics/fasta-accession-version-suffix",
    title: "FASTA Accession Version Suffix",
    description:
      "Split a final dot plus numeric accession version from supplied FASTA identifier text without validating an accession registry.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accessionToken: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["accessionToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        accession: { type: "string", maxLength: 8192 },
        versionText: { type: "string", maxLength: 8192 },
        hasNumericVersion: { type: "boolean" },
      },
      required: ["accession", "versionText", "hasNumericVersion"],
    },
    ports: {
      inputs: [
        {
          id: "accessionToken",
          label: "Accession Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "accession", label: "Accession", valueType: { type: "string" } },
        {
          id: "versionText",
          label: "Version Text",
          valueType: { type: "string" },
        },
        {
          id: "hasNumericVersion",
          label: "Has Numeric Version",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = fastaAccessionVersionSuffixTool.execute;
export default fastaAccessionVersionSuffixTool;
