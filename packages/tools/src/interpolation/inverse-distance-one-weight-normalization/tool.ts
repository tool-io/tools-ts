import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly distance: number;
  readonly power: number;
  readonly otherWeightSum: number;
};
export type Output = { readonly weight: number; readonly normalized: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    distance: { type: "number", exclusiveMinimum: 0 },
    power: { type: "number", exclusiveMinimum: 0 },
    otherWeightSum: { type: "number", minimum: 0 },
  },
  required: ["distance", "power", "otherWeightSum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" }, normalized: { type: "number" } },
  required: ["weight", "normalized"],
} as const;
/** Calculate inverse distance one weight normalization from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { distance, power, otherWeightSum } = input;
  const compute = (): Output => {
    H.positive(distance);
    H.positive(power);
    H.domain(otherWeightSum >= 0);
    const weight = distance ** -power;
    return { weight, normalized: weight / (weight + otherWeightSum) };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { distance: 2, power: 2, otherWeightSum: 0.75 },
  output: { weight: 0.25, normalized: 0.25 },
} satisfies ToolExample<Input, Output>;
export const inverseDistanceOneWeightNormalizationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/inverse-distance-one-weight-normalization",
      title: "Inverse Distance One Weight Normalization Tool",
      description:
        "Calculate inverse distance one weight normalization from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number", exclusiveMinimum: 0 },
          power: { type: "number", exclusiveMinimum: 0 },
          otherWeightSum: { type: "number", minimum: 0 },
        },
        required: ["distance", "power", "otherWeightSum"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weight: { type: "number" },
          normalized: { type: "number" },
        },
        required: ["weight", "normalized"],
      },
      ports: {
        inputs: [
          {
            id: "distance",
            label: "Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "power",
            label: "Power",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "otherWeightSum",
            label: "Other Weight Sum",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "weight", label: "Weight", valueType: { type: "number" } },
          {
            id: "normalized",
            label: "Normalized",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = inverseDistanceOneWeightNormalizationTool.execute;
export default inverseDistanceOneWeightNormalizationTool;
