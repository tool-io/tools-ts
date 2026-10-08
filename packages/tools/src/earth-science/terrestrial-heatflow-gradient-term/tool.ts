import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly thermalConductivity: number;
  readonly signedTemperatureGradient: number;
};
export type Output = { readonly signedHeatFlux: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    thermalConductivity: { type: "number", minimum: 0 },
    signedTemperatureGradient: { type: "number" },
  },
  required: ["thermalConductivity", "signedTemperatureGradient"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedHeatFlux: { type: "number" } },
  required: ["signedHeatFlux"],
} as const;
/** Apply one-dimensional Fourier heat flux to explicit conductivity and signed temperature gradient along the same chosen positive axis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { thermalConductivity, signedTemperatureGradient } = request;
  const compute = (): Output => {
    H.domain(thermalConductivity >= 0, "thermalConductivity");
    return { signedHeatFlux: -thermalConductivity * signedTemperatureGradient };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { thermalConductivity: 2, signedTemperatureGradient: -0.03 },
  output: { signedHeatFlux: 0.06 },
} satisfies ToolExample<Input, Output>;
export const terrestrialHeatflowGradientTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/terrestrial-heatflow-gradient-term",
    title: "Terrestrial Heatflow Gradient Term Tool",
    description:
      "Apply one-dimensional Fourier heat flux to explicit conductivity and signed temperature gradient along the same chosen positive axis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        thermalConductivity: { type: "number", minimum: 0 },
        signedTemperatureGradient: { type: "number" },
      },
      required: ["thermalConductivity", "signedTemperatureGradient"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedHeatFlux: { type: "number" } },
      required: ["signedHeatFlux"],
    },
    ports: {
      inputs: [
        {
          id: "thermalConductivity",
          label: "Thermal Conductivity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedTemperatureGradient",
          label: "Signed Temperature Gradient",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedHeatFlux",
          label: "Signed Heat Flux",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = terrestrialHeatflowGradientTermTool.execute;
export default terrestrialHeatflowGradientTermTool;
