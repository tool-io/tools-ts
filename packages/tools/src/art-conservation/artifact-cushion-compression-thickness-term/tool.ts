import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly freeThickness: number;
  readonly installedThickness: number;
  readonly cushionArea: number;
};
export type Output = {
  readonly compression: number;
  readonly compressionFraction: number;
  readonly displacedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freeThickness: { type: "number", exclusiveMinimum: 0 },
    installedThickness: { type: "number", minimum: 0 },
    cushionArea: { type: "number", minimum: 0 },
  },
  required: ["freeThickness", "installedThickness", "cushionArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compression: { type: "number" },
    compressionFraction: { type: "number" },
    displacedVolume: { type: "number" },
  },
  required: ["compression", "compressionFraction", "displacedVolume"],
} as const;
/** Calculate artifact cushion compression thickness term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { freeThickness, installedThickness, cushionArea } = request;
  const compute = (): Output => {
    H.positive(freeThickness);
    H.domain(
      installedThickness >= 0 &&
        installedThickness <= freeThickness &&
        cushionArea >= 0,
    );
    return {
      compression: freeThickness - installedThickness,
      compressionFraction: (freeThickness - installedThickness) / freeThickness,
      displacedVolume: (freeThickness - installedThickness) * cushionArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { freeThickness: 10, installedThickness: 8, cushionArea: 100 },
  output: { compression: 2, compressionFraction: 0.2, displacedVolume: 200 },
} satisfies ToolExample<Input, Output>;
export const artifactCushionCompressionThicknessTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "art-conservation/artifact-cushion-compression-thickness-term",
      title: "Artifact Cushion Compression Thickness Term Tool",
      description:
        "Calculate artifact cushion compression thickness term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          freeThickness: { type: "number", exclusiveMinimum: 0 },
          installedThickness: { type: "number", minimum: 0 },
          cushionArea: { type: "number", minimum: 0 },
        },
        required: ["freeThickness", "installedThickness", "cushionArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          compression: { type: "number" },
          compressionFraction: { type: "number" },
          displacedVolume: { type: "number" },
        },
        required: ["compression", "compressionFraction", "displacedVolume"],
      },
      ports: {
        inputs: [
          {
            id: "freeThickness",
            label: "Free Thickness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "installedThickness",
            label: "Installed Thickness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "cushionArea",
            label: "Cushion Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "compression",
            label: "Compression",
            valueType: { type: "number" },
          },
          {
            id: "compressionFraction",
            label: "Compression Fraction",
            valueType: { type: "number" },
          },
          {
            id: "displacedVolume",
            label: "Displaced Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = artifactCushionCompressionThicknessTermTool.execute;
export default artifactCushionCompressionThicknessTermTool;
