import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialArea: number;
  readonly finalArea: number;
  readonly initialThickness: number;
  readonly volumeRetention: number;
};
export type Output = {
  readonly areaStretch: number;
  readonly finalThickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialArea: { type: "number", exclusiveMinimum: 0 },
    finalArea: { type: "number", exclusiveMinimum: 0 },
    initialThickness: { type: "number", minimum: 0 },
    volumeRetention: { type: "number", minimum: 0 },
  },
  required: ["initialArea", "finalArea", "initialThickness", "volumeRetention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaStretch: { type: "number" },
    finalThickness: { type: "number" },
  },
  required: ["areaStretch", "finalThickness"],
} as const;
/** Uniform sheet thickness from supplied area stretch and volume retention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialArea, finalArea, initialThickness, volumeRetention } = request;
  const compute = (): Output => {
    H.positive(initialArea);
    H.positive(finalArea);
    H.domain(initialThickness >= 0 && volumeRetention >= 0);
    return {
      areaStretch: finalArea / initialArea,
      finalThickness:
        (initialThickness * initialArea * volumeRetention) / finalArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialArea: 100,
    finalArea: 125,
    initialThickness: 1,
    volumeRetention: 1,
  },
  output: { areaStretch: 1.25, finalThickness: 0.8 },
} satisfies ToolExample<Input, Output>;
export const alignerBenchMaterialThicknessFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "orthodontics/aligner-bench-material-thickness-factor",
      title: "Aligner Bench Material Thickness Factor Tool",
      description:
        "Uniform sheet thickness from supplied area stretch and volume retention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialArea: { type: "number", exclusiveMinimum: 0 },
          finalArea: { type: "number", exclusiveMinimum: 0 },
          initialThickness: { type: "number", minimum: 0 },
          volumeRetention: { type: "number", minimum: 0 },
        },
        required: [
          "initialArea",
          "finalArea",
          "initialThickness",
          "volumeRetention",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          areaStretch: { type: "number" },
          finalThickness: { type: "number" },
        },
        required: ["areaStretch", "finalThickness"],
      },
      ports: {
        inputs: [
          {
            id: "initialArea",
            label: "Initial Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "finalArea",
            label: "Final Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "initialThickness",
            label: "Initial Thickness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "volumeRetention",
            label: "Volume Retention",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "areaStretch",
            label: "Area Stretch",
            valueType: { type: "number" },
          },
          {
            id: "finalThickness",
            label: "Final Thickness",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = alignerBenchMaterialThicknessFactorTool.execute;
export default alignerBenchMaterialThicknessFactorTool;
