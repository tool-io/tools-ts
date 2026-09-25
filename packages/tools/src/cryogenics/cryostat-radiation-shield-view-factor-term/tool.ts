import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly hotTemperatureK: number;
  readonly coldTemperatureK: number;
  readonly area: number;
  readonly effectiveEmissivity: number;
  readonly viewFactor: number;
  readonly stefanBoltzmann: number;
};
export type Output = { readonly heatLoad: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hotTemperatureK: { type: "number" },
    coldTemperatureK: { type: "number", minimum: 0 },
    area: { type: "number", minimum: 0 },
    effectiveEmissivity: { type: "number", minimum: 0, maximum: 1 },
    viewFactor: { type: "number", minimum: 0, maximum: 1 },
    stefanBoltzmann: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "hotTemperatureK",
    "coldTemperatureK",
    "area",
    "effectiveEmissivity",
    "viewFactor",
    "stefanBoltzmann",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { heatLoad: { type: "number" } },
  required: ["heatLoad"],
} as const;
/** Explicit effective greybody exchange coefficient and view factor; multiple shield interactions are not solved. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    hotTemperatureK,
    coldTemperatureK,
    area,
    effectiveEmissivity,
    viewFactor,
    stefanBoltzmann,
  } = request;
  const compute = (): Output => {
    H.domain(
      hotTemperatureK >= coldTemperatureK && coldTemperatureK >= 0 && area >= 0,
    );
    H.probability(effectiveEmissivity);
    H.probability(viewFactor);
    H.positive(stefanBoltzmann);
    return {
      heatLoad:
        area *
        effectiveEmissivity *
        viewFactor *
        stefanBoltzmann *
        (hotTemperatureK ** 4 - coldTemperatureK ** 4),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    hotTemperatureK: 300,
    coldTemperatureK: 100,
    area: 1,
    effectiveEmissivity: 0.1,
    viewFactor: 1,
    stefanBoltzmann: 5.670374419e-8,
  },
  output: { heatLoad: 45.362995352 },
} satisfies ToolExample<Input, Output>;
export const cryostatRadiationShieldViewFactorTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cryogenics/cryostat-radiation-shield-view-factor-term",
      title: "Cryostat Radiation Shield View Factor Term Tool",
      description:
        "Explicit effective greybody exchange coefficient and view factor; multiple shield interactions are not solved.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hotTemperatureK: { type: "number" },
          coldTemperatureK: { type: "number", minimum: 0 },
          area: { type: "number", minimum: 0 },
          effectiveEmissivity: { type: "number", minimum: 0, maximum: 1 },
          viewFactor: { type: "number", minimum: 0, maximum: 1 },
          stefanBoltzmann: { type: "number", exclusiveMinimum: 0 },
        },
        required: [
          "hotTemperatureK",
          "coldTemperatureK",
          "area",
          "effectiveEmissivity",
          "viewFactor",
          "stefanBoltzmann",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { heatLoad: { type: "number" } },
        required: ["heatLoad"],
      },
      ports: {
        inputs: [
          {
            id: "hotTemperatureK",
            label: "Hot Temperature K",
            required: true,
            valueType: { type: "number", unit: "K" },
          },
          {
            id: "coldTemperatureK",
            label: "Cold Temperature K",
            required: true,
            valueType: { type: "number", unit: "K" },
          },
          {
            id: "area",
            label: "Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "effectiveEmissivity",
            label: "Effective Emissivity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "viewFactor",
            label: "View Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "stefanBoltzmann",
            label: "Stefan Boltzmann",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "heatLoad", label: "Heat Load", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = cryostatRadiationShieldViewFactorTermTool.execute;
export default cryostatRadiationShieldViewFactorTermTool;
