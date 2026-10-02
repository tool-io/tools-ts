import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assembly: string;
  readonly expectedAssembly: string;
  readonly accession: string;
  readonly expectedAccession: string;
  readonly position: number;
  readonly expectedPosition: number;
};
export type Output = {
  readonly assemblyMatches: boolean;
  readonly accessionMatches: boolean;
  readonly positionMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assembly: { type: "string", maxLength: 8192 },
    expectedAssembly: { type: "string", maxLength: 8192 },
    accession: { type: "string", maxLength: 8192 },
    expectedAccession: { type: "string", maxLength: 8192 },
    position: { type: "integer", minimum: 1 },
    expectedPosition: { type: "integer", minimum: 1 },
  },
  required: [
    "assembly",
    "expectedAssembly",
    "accession",
    "expectedAccession",
    "position",
    "expectedPosition",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assemblyMatches: { type: "boolean" },
    accessionMatches: { type: "boolean" },
    positionMatches: { type: "boolean" },
  },
  required: ["assemblyMatches", "accessionMatches", "positionMatches"],
} as const;
/** Compare supplied coordinate/reference metadata without liftover or sequence interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    assembly,
    expectedAssembly,
    accession,
    expectedAccession,
    position,
    expectedPosition,
  } = request;
  const compute = (): Output => {
    H.integer(position, 1);
    H.integer(expectedPosition, 1);
    return {
      assemblyMatches: assembly === expectedAssembly,
      accessionMatches: accession === expectedAccession,
      positionMatches: position === expectedPosition,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    assembly: "A",
    expectedAssembly: "A",
    accession: "chr1",
    expectedAccession: "chr1",
    position: 100,
    expectedPosition: 100,
  },
  output: {
    assemblyMatches: true,
    accessionMatches: true,
    positionMatches: true,
  },
} satisfies ToolExample<Input, Output>;
export const pharmacogenomicAssemblyCoordinateSourcePairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacogenomics/pharmacogenomic-assembly-coordinate-source-pair",
      title: "Pharmacogenomic Assembly Coordinate Source Pair Tool",
      description:
        "Compare supplied coordinate/reference metadata without liftover or sequence interpretation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          assembly: { type: "string", maxLength: 8192 },
          expectedAssembly: { type: "string", maxLength: 8192 },
          accession: { type: "string", maxLength: 8192 },
          expectedAccession: { type: "string", maxLength: 8192 },
          position: { type: "integer", minimum: 1 },
          expectedPosition: { type: "integer", minimum: 1 },
        },
        required: [
          "assembly",
          "expectedAssembly",
          "accession",
          "expectedAccession",
          "position",
          "expectedPosition",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          assemblyMatches: { type: "boolean" },
          accessionMatches: { type: "boolean" },
          positionMatches: { type: "boolean" },
        },
        required: ["assemblyMatches", "accessionMatches", "positionMatches"],
      },
      ports: {
        inputs: [
          {
            id: "assembly",
            label: "Assembly",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedAssembly",
            label: "Expected Assembly",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "accession",
            label: "Accession",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedAccession",
            label: "Expected Accession",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "position",
            label: "Position",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "expectedPosition",
            label: "Expected Position",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "assemblyMatches",
            label: "Assembly Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "accessionMatches",
            label: "Accession Matches",
            valueType: { type: "boolean" },
          },
          {
            id: "positionMatches",
            label: "Position Matches",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pharmacogenomicAssemblyCoordinateSourcePairTool.execute;
export default pharmacogenomicAssemblyCoordinateSourcePairTool;
