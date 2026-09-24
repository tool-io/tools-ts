import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly arealMassDensity: number;
  readonly volumeMassDensity: number;
  readonly sourceToCompatibleFactor: number;
};
export type Output = { readonly thickness: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    arealMassDensity: { type: "number", minimum: 0 },
    volumeMassDensity: { type: "number", exclusiveMinimum: 0 },
    sourceToCompatibleFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "arealMassDensity",
    "volumeMassDensity",
    "sourceToCompatibleFactor",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { thickness: { type: "number" } },
  required: ["thickness"],
} as const;
/** Calculate surface density linear thickness factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { arealMassDensity, volumeMassDensity, sourceToCompatibleFactor } =
    request;
  const compute = (): Output => {
    H.domain(arealMassDensity >= 0);
    H.positive(volumeMassDensity);
    H.positive(sourceToCompatibleFactor);
    return {
      thickness:
        (arealMassDensity * sourceToCompatibleFactor) / volumeMassDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    arealMassDensity: 2,
    volumeMassDensity: 1000,
    sourceToCompatibleFactor: 1,
  },
  output: { thickness: 0.002 },
} satisfies ToolExample<Input, Output>;
export const surfaceDensityLinearThicknessFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "convert/surface-density-linear-thickness-factor",
      title: "Surface Density Linear Thickness Factor Tool",
      description:
        "Calculate surface density linear thickness factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          arealMassDensity: { type: "number", minimum: 0 },
          volumeMassDensity: { type: "number", exclusiveMinimum: 0 },
          sourceToCompatibleFactor: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "arealMassDensity",
          "volumeMassDensity",
          "sourceToCompatibleFactor",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { thickness: { type: "number" } },
        required: ["thickness"],
      },
      ports: {
        inputs: [
          {
            id: "arealMassDensity",
            label: "Areal Mass Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "volumeMassDensity",
            label: "Volume Mass Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourceToCompatibleFactor",
            label: "Source To Compatible Factor",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "thickness",
            label: "Thickness",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = surfaceDensityLinearThicknessFactorTool.execute;
export default surfaceDensityLinearThicknessFactorTool;
