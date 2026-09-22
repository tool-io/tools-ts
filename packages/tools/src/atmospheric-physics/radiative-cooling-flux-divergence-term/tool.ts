import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly topUpwardFlux: number;
  readonly bottomUpwardFlux: number;
  readonly density: number;
  readonly heatCapacity: number;
  readonly thickness: number;
};
export type Output = {
  readonly fluxDivergence: number;
  readonly temperatureTendency: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    topUpwardFlux: { type: "number" },
    bottomUpwardFlux: { type: "number" },
    density: { type: "number", exclusiveMinimum: 0 },
    heatCapacity: { type: "number", exclusiveMinimum: 0 },
    thickness: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "topUpwardFlux",
    "bottomUpwardFlux",
    "density",
    "heatCapacity",
    "thickness",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fluxDivergence: { type: "number" },
    temperatureTendency: { type: "number" },
  },
  required: ["fluxDivergence", "temperatureTendency"],
} as const;
/** Layer energy balance with upward-positive net flux and tendency in K/s for SI inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { topUpwardFlux, bottomUpwardFlux, density, heatCapacity, thickness } =
    request;
  const compute = (): Output => {
    H.positive(density);
    H.positive(heatCapacity);
    H.positive(thickness);
    return {
      fluxDivergence: (topUpwardFlux - bottomUpwardFlux) / thickness,
      temperatureTendency:
        -(topUpwardFlux - bottomUpwardFlux) /
        (density * heatCapacity * thickness),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    topUpwardFlux: 150,
    bottomUpwardFlux: 100,
    density: 1,
    heatCapacity: 1000,
    thickness: 100,
  },
  output: { fluxDivergence: 0.5, temperatureTendency: -0.0005 },
} satisfies ToolExample<Input, Output>;
export const radiativeCoolingFluxDivergenceTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "atmospheric-physics/radiative-cooling-flux-divergence-term",
    title: "Radiative Cooling Flux Divergence Term Tool",
    description:
      "Layer energy balance with upward-positive net flux and tendency in K/s for SI inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        topUpwardFlux: { type: "number" },
        bottomUpwardFlux: { type: "number" },
        density: { type: "number", exclusiveMinimum: 0 },
        heatCapacity: { type: "number", exclusiveMinimum: 0 },
        thickness: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "topUpwardFlux",
        "bottomUpwardFlux",
        "density",
        "heatCapacity",
        "thickness",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fluxDivergence: { type: "number" },
        temperatureTendency: { type: "number" },
      },
      required: ["fluxDivergence", "temperatureTendency"],
    },
    ports: {
      inputs: [
        {
          id: "topUpwardFlux",
          label: "Top Upward Flux",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bottomUpwardFlux",
          label: "Bottom Upward Flux",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "density",
          label: "Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "heatCapacity",
          label: "Heat Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "thickness",
          label: "Thickness",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fluxDivergence",
          label: "Flux Divergence",
          valueType: { type: "number" },
        },
        {
          id: "temperatureTendency",
          label: "Temperature Tendency",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = radiativeCoolingFluxDivergenceTermTool.execute;
export default radiativeCoolingFluxDivergenceTermTool;
