import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominalArea: number;
  readonly seamArea: number;
  readonly seamMultiplier: number;
  readonly blanketHeatFlux: number;
};
export type Output = {
  readonly effectiveArea: number;
  readonly estimatedHeatLoad: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalArea: { type: "number" },
    seamArea: { type: "number", minimum: 0 },
    seamMultiplier: { type: "number", minimum: 0 },
    blanketHeatFlux: { type: "number", minimum: 0 },
  },
  required: ["nominalArea", "seamArea", "seamMultiplier", "blanketHeatFlux"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveArea: { type: "number" },
    estimatedHeatLoad: { type: "number" },
  },
  required: ["effectiveArea", "estimatedHeatLoad"],
} as const;
/** Area-weighted empirical heat-flux model with explicit seam multiplier; no insulation performance coefficient is invented. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominalArea, seamArea, seamMultiplier, blanketHeatFlux } = request;
  const compute = (): Output => {
    H.domain(
      seamArea >= 0 &&
        nominalArea >= seamArea &&
        seamMultiplier >= 0 &&
        blanketHeatFlux >= 0,
    );
    return {
      effectiveArea: nominalArea + seamArea * (seamMultiplier - 1),
      estimatedHeatLoad:
        (nominalArea + seamArea * (seamMultiplier - 1)) * blanketHeatFlux,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nominalArea: 10,
    seamArea: 1,
    seamMultiplier: 3,
    blanketHeatFlux: 0.5,
  },
  output: { effectiveArea: 12, estimatedHeatLoad: 6 },
} satisfies ToolExample<Input, Output>;
export const multilayerInsulationEffectiveAreaFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cryogenics/multilayer-insulation-effective-area-factor",
      title: "Multilayer Insulation Effective Area Factor Tool",
      description:
        "Area-weighted empirical heat-flux model with explicit seam multiplier; no insulation performance coefficient is invented.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nominalArea: { type: "number" },
          seamArea: { type: "number", minimum: 0 },
          seamMultiplier: { type: "number", minimum: 0 },
          blanketHeatFlux: { type: "number", minimum: 0 },
        },
        required: [
          "nominalArea",
          "seamArea",
          "seamMultiplier",
          "blanketHeatFlux",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effectiveArea: { type: "number" },
          estimatedHeatLoad: { type: "number" },
        },
        required: ["effectiveArea", "estimatedHeatLoad"],
      },
      ports: {
        inputs: [
          {
            id: "nominalArea",
            label: "Nominal Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "seamArea",
            label: "Seam Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "seamMultiplier",
            label: "Seam Multiplier",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "blanketHeatFlux",
            label: "Blanket Heat Flux",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "effectiveArea",
            label: "Effective Area",
            valueType: { type: "number" },
          },
          {
            id: "estimatedHeatLoad",
            label: "Estimated Heat Load",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = multilayerInsulationEffectiveAreaFactorTool.execute;
export default multilayerInsulationEffectiveAreaFactorTool;
