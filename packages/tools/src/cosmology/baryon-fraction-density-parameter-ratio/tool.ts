import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baryonDensityParameter: number;
  readonly matterDensityParameter: number;
};
export type Output = { readonly baryonFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baryonDensityParameter: { type: "number", minimum: 0 },
    matterDensityParameter: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["baryonDensityParameter", "matterDensityParameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { baryonFraction: { type: "number" } },
  required: ["baryonFraction"],
} as const;
/** Divide supplied baryon by total matter density parameters on the same epoch and normalization basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baryonDensityParameter, matterDensityParameter } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(matterDensityParameter) && matterDensityParameter > 0,
      "matterDensityParameter",
    ),
      matterDensityParameter);
    H.domain(
      baryonDensityParameter >= 0 &&
        baryonDensityParameter <= matterDensityParameter,
      "baryonDensityParameter",
    );
    return { baryonFraction: baryonDensityParameter / matterDensityParameter };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baryonDensityParameter: 0.05, matterDensityParameter: 0.25 },
  output: { baryonFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const baryonFractionDensityParameterRatioTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["cosmology", "physics"],
        keywords: ["cosmology", "physics"],
      },
      id: "cosmology/baryon-fraction-density-parameter-ratio",
      title: "Baryon Fraction Density Parameter Ratio",
      description:
        "Divide supplied baryon by total matter density parameters on the same epoch and normalization basis.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baryonDensityParameter: { type: "number", minimum: 0 },
          matterDensityParameter: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["baryonDensityParameter", "matterDensityParameter"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { baryonFraction: { type: "number" } },
        required: ["baryonFraction"],
      },
      ports: {
        inputs: [
          {
            id: "baryonDensityParameter",
            label: "Baryon Density Parameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "matterDensityParameter",
            label: "Matter Density Parameter",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "baryonFraction",
            label: "Baryon Fraction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = baryonFractionDensityParameterRatioTool.execute;
export default baryonFractionDensityParameterRatioTool;
