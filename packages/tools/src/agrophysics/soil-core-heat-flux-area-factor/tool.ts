import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly energyJ: number;
  readonly durationSeconds: number;
  readonly areaM2: number;
};
export type Output = { readonly heatFlux: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energyJ: { type: "number" },
    durationSeconds: { type: "number", exclusiveMinimum: 0 },
    areaM2: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["energyJ", "durationSeconds", "areaM2"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { heatFlux: { type: "number" } },
  required: ["heatFlux"],
} as const;
/** Calculate soil core heat flux area factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { energyJ, durationSeconds, areaM2 } = request;
  const compute = (): Output => {
    H.positive(durationSeconds);
    H.positive(areaM2);
    return { heatFlux: energyJ / (durationSeconds * areaM2) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { energyJ: 120, durationSeconds: 10, areaM2: 0.2 },
  output: { heatFlux: 60 },
} satisfies ToolExample<Input, Output>;
export const soilCoreHeatFluxAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrophysics/soil-core-heat-flux-area-factor",
    title: "Soil Core Heat Flux Area Factor Tool",
    description:
      "Calculate soil core heat flux area factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energyJ: { type: "number" },
        durationSeconds: { type: "number", exclusiveMinimum: 0 },
        areaM2: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["energyJ", "durationSeconds", "areaM2"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { heatFlux: { type: "number" } },
      required: ["heatFlux"],
    },
    ports: {
      inputs: [
        {
          id: "energyJ",
          label: "Energy J",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "durationSeconds",
          label: "Duration Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaM2",
          label: "Area M2",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "heatFlux", label: "Heat Flux", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = soilCoreHeatFluxAreaFactorTool.execute;
export default soilCoreHeatFluxAreaFactorTool;
