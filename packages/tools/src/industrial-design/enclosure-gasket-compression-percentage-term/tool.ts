import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly freeThickness: number;
  readonly installedThickness: number;
};
export type Output = {
  readonly compressionFraction: number;
  readonly compressionPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    freeThickness: { type: "number", exclusiveMinimum: 0 },
    installedThickness: { type: "number", minimum: 0 },
  },
  required: ["freeThickness", "installedThickness"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    compressionFraction: { type: "number" },
    compressionPercent: { type: "number" },
  },
  required: ["compressionFraction", "compressionPercent"],
} as const;
/** Retain negative compression when an explicit installed thickness exceeds the free thickness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { freeThickness, installedThickness } = request;
  const compute = (): Output => {
    H.positive(freeThickness);
    H.domain(installedThickness >= 0);
    return {
      compressionFraction: (freeThickness - installedThickness) / freeThickness,
      compressionPercent:
        (100 * (freeThickness - installedThickness)) / freeThickness,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { freeThickness: 4, installedThickness: 3 },
  output: { compressionFraction: 0.25, compressionPercent: 25 },
} satisfies ToolExample<Input, Output>;
export const enclosureGasketCompressionPercentageTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-design/enclosure-gasket-compression-percentage-term",
      title: "Enclosure Gasket Compression Percentage Term Tool",
      description:
        "Retain negative compression when an explicit installed thickness exceeds the free thickness.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          freeThickness: { type: "number", exclusiveMinimum: 0 },
          installedThickness: { type: "number", minimum: 0 },
        },
        required: ["freeThickness", "installedThickness"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          compressionFraction: { type: "number" },
          compressionPercent: { type: "number" },
        },
        required: ["compressionFraction", "compressionPercent"],
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
        ],
        outputs: [
          {
            id: "compressionFraction",
            label: "Compression Fraction",
            valueType: { type: "number" },
          },
          {
            id: "compressionPercent",
            label: "Compression Percent",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = enclosureGasketCompressionPercentageTermTool.execute;
export default enclosureGasketCompressionPercentageTermTool;
