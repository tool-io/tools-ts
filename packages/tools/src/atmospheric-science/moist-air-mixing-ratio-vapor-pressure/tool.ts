import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vaporPressure: number;
  readonly totalPressure: number;
  readonly molecularMassRatio: number;
};
export type Output = { readonly mixingRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vaporPressure: { type: "number", minimum: 0 },
    totalPressure: { type: "number" },
    molecularMassRatio: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["vaporPressure", "totalPressure", "molecularMassRatio"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { mixingRatio: { type: "number" } },
  required: ["mixingRatio"],
} as const;
/** Calculate moist air mixing ratio vapor pressure from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vaporPressure, totalPressure, molecularMassRatio } = request;
  const compute = (): Output => {
    H.domain(vaporPressure >= 0 && totalPressure > vaporPressure);
    H.positive(molecularMassRatio);
    return {
      mixingRatio:
        (molecularMassRatio * vaporPressure) / (totalPressure - vaporPressure),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    vaporPressure: 2000,
    totalPressure: 100000,
    molecularMassRatio: 0.622,
  },
  output: { mixingRatio: 0.012693877551020407 },
} satisfies ToolExample<Input, Output>;
export const moistAirMixingRatioVaporPressureTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-science/moist-air-mixing-ratio-vapor-pressure",
    title: "Moist Air Mixing Ratio Vapor Pressure Tool",
    description:
      "Calculate moist air mixing ratio vapor pressure from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vaporPressure: { type: "number", minimum: 0 },
        totalPressure: { type: "number" },
        molecularMassRatio: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["vaporPressure", "totalPressure", "molecularMassRatio"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { mixingRatio: { type: "number" } },
      required: ["mixingRatio"],
    },
    ports: {
      inputs: [
        {
          id: "vaporPressure",
          label: "Vapor Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalPressure",
          label: "Total Pressure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "molecularMassRatio",
          label: "Molecular Mass Ratio",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mixingRatio",
          label: "Mixing Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = moistAirMixingRatioVaporPressureTool.execute;
export default moistAirMixingRatioVaporPressureTool;
