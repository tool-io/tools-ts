import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly wetDimensions: readonly number[];
  readonly dryDimensions: readonly number[];
};
export type Output = {
  readonly retentions: readonly number[];
  readonly volumeRetention: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wetDimensions: { type: "array", maxItems: 256, items: { type: "number" } },
    dryDimensions: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["wetDimensions", "dryDimensions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retentions: { type: "array", maxItems: 256, items: { type: "number" } },
    volumeRetention: { type: "number" },
  },
  required: ["retentions", "volumeRetention"],
} as const;
/** Calculate biofabrication dry wet shrinkage factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { wetDimensions, dryDimensions } = request;
  const compute = (): Output => {
    H.sameLength(wetDimensions, dryDimensions);
    H.domain(
      wetDimensions.length > 0 &&
        wetDimensions.every((x) => x > 0) &&
        dryDimensions.every((x) => x >= 0),
    );
    return {
      retentions: dryDimensions.map((x, i) => x / wetDimensions[i]),
      volumeRetention: dryDimensions.reduce(
        (a, x, i) => (a * x) / wetDimensions[i],
        1,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { wetDimensions: [10, 20, 30], dryDimensions: [8, 18, 27] },
  output: { retentions: [0.8, 0.9, 0.9], volumeRetention: 0.6479999999999999 },
} satisfies ToolExample<Input, Output>;
export const biofabricationDryWetShrinkageFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biofabrication/biofabrication-dry-wet-shrinkage-factor",
      title: "Biofabrication Dry Wet Shrinkage Factor Tool",
      description:
        "Calculate biofabrication dry wet shrinkage factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          wetDimensions: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          dryDimensions: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
        },
        required: ["wetDimensions", "dryDimensions"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          retentions: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          volumeRetention: { type: "number" },
        },
        required: ["retentions", "volumeRetention"],
      },
      ports: {
        inputs: [
          {
            id: "wetDimensions",
            label: "Wet Dimensions",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "dryDimensions",
            label: "Dry Dimensions",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
        ],
        outputs: [
          {
            id: "retentions",
            label: "Retentions",
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "volumeRetention",
            label: "Volume Retention",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biofabricationDryWetShrinkageFactorTool.execute;
export default biofabricationDryWetShrinkageFactorTool;
