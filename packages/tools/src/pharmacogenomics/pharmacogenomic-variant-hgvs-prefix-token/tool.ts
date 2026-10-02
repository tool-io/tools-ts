import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly token: string };
export type Output = {
  readonly accession: string;
  readonly coordinateSystem: string;
  readonly description: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accession: { type: "string", maxLength: 8192 },
    coordinateSystem: { type: "string", maxLength: 8192 },
    description: { type: "string", maxLength: 8192 },
  },
  required: ["accession", "coordinateSystem", "description"],
} as const;
/** Split a versioned HGVS accession prefix without validating the variant or reference sequence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token } = request;
  const compute = (): Output => {
    const match =
      /^([A-Za-z][A-Za-z0-9_]*\.\d+):([cgmonrp])\.(.+)(?![\s\S])/.exec(token);
    H.domain(match && !/[\r\n]/.test(token), "token");
    return {
      accession: match[1],
      coordinateSystem: match[2],
      description: match[3],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { token: "NM_000123.4:c.12A>G" },
  output: {
    accession: "NM_000123.4",
    coordinateSystem: "c",
    description: "12A>G",
  },
} satisfies ToolExample<Input, Output>;
export const pharmacogenomicVariantHgvsPrefixTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogenomic-variant-hgvs-prefix-token",
      title: "Pharmacogenomic Variant Hgvs Prefix Token Tool",
      description:
        "Split a versioned HGVS accession prefix without validating the variant or reference sequence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { token: { type: "string", maxLength: 8192 } },
        required: ["token"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          accession: { type: "string", maxLength: 8192 },
          coordinateSystem: { type: "string", maxLength: 8192 },
          description: { type: "string", maxLength: 8192 },
        },
        required: ["accession", "coordinateSystem", "description"],
      },
      ports: {
        inputs: [
          {
            id: "token",
            label: "Token",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "accession",
            label: "Accession",
            valueType: { type: "string" },
          },
          {
            id: "coordinateSystem",
            label: "Coordinate System",
            valueType: { type: "string" },
          },
          {
            id: "description",
            label: "Description",
            valueType: { type: "string" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogenomicVariantHgvsPrefixTokenTool.execute;
export default pharmacogenomicVariantHgvsPrefixTokenTool;
