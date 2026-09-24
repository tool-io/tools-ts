import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly luminosityDistance: number;
  readonly angularDistance: number;
  readonly redshift: number;
};
export type Output = {
  readonly predictedLuminosityDistance: number;
  readonly residual: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    luminosityDistance: { type: "number", minimum: 0 },
    angularDistance: { type: "number", exclusiveMinimum: 0 },
    redshift: { type: "number", exclusiveMinimum: -1 },
  },
  required: ["luminosityDistance", "angularDistance", "redshift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedLuminosityDistance: { type: "number" },
    residual: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["predictedLuminosityDistance", "residual", "ratio"],
} as const;
/** Etherington distance-duality residual under metric photon-conserving propagation; no cosmological parameter fit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { luminosityDistance, angularDistance, redshift } = request;
  const compute = (): Output => {
    H.domain(luminosityDistance >= 0 && redshift > -1);
    H.positive(angularDistance);
    return {
      predictedLuminosityDistance: angularDistance * (1 + redshift) ** 2,
      residual: luminosityDistance - angularDistance * (1 + redshift) ** 2,
      ratio: luminosityDistance / (angularDistance * (1 + redshift) ** 2),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { luminosityDistance: 400, angularDistance: 100, redshift: 1 },
  output: { predictedLuminosityDistance: 400, residual: 0, ratio: 1 },
} satisfies ToolExample<Input, Output>;
export const luminosityAngularDistanceDualityResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cosmology/luminosity-angular-distance-duality-residual",
      title: "Luminosity Angular Distance Duality Residual Tool",
      description:
        "Etherington distance-duality residual under metric photon-conserving propagation; no cosmological parameter fit.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          luminosityDistance: { type: "number", minimum: 0 },
          angularDistance: { type: "number", exclusiveMinimum: 0 },
          redshift: { type: "number", exclusiveMinimum: -1 },
        },
        required: ["luminosityDistance", "angularDistance", "redshift"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          predictedLuminosityDistance: { type: "number" },
          residual: { type: "number" },
          ratio: { type: "number" },
        },
        required: ["predictedLuminosityDistance", "residual", "ratio"],
      },
      ports: {
        inputs: [
          {
            id: "luminosityDistance",
            label: "Luminosity Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "angularDistance",
            label: "Angular Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "redshift",
            label: "Redshift",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "predictedLuminosityDistance",
            label: "Predicted Luminosity Distance",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
          { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = luminosityAngularDistanceDualityResidualTool.execute;
export default luminosityAngularDistanceDualityResidualTool;
