import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly temperatureK: number;
  readonly emissivity: number;
  readonly stefanBoltzmann: number;
};
export type Output = {
  readonly blackbodyFlux: number;
  readonly emittedFlux: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    temperatureK: { type: "number", minimum: 0 },
    emissivity: { type: "number", minimum: 0, maximum: 1 },
    stefanBoltzmann: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["temperatureK", "emissivity", "stefanBoltzmann"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blackbodyFlux: { type: "number" },
    emittedFlux: { type: "number" },
  },
  required: ["blackbodyFlux", "emittedFlux"],
} as const;
/** Greybody hemispheric thermal flux with an explicit SI Stefan-Boltzmann constant; no atmospheric emissivity model is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { temperatureK, emissivity, stefanBoltzmann } = request;
  const compute = (): Output => {
    H.domain(temperatureK >= 0);
    H.probability(emissivity);
    H.positive(stefanBoltzmann);
    return {
      blackbodyFlux: stefanBoltzmann * temperatureK ** 4,
      emittedFlux: emissivity * stefanBoltzmann * temperatureK ** 4,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    temperatureK: 300,
    emissivity: 0.8,
    stefanBoltzmann: 5.670374419e-8,
  },
  output: { blackbodyFlux: 459.300327939, emittedFlux: 367.44026235120003 },
} satisfies ToolExample<Input, Output>;
export const atmosphericEmissivityBlackbodyFluxTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-physics/atmospheric-emissivity-blackbody-flux-term",
      title: "Atmospheric Emissivity Blackbody Flux Term Tool",
      description:
        "Greybody hemispheric thermal flux with an explicit SI Stefan-Boltzmann constant; no atmospheric emissivity model is selected.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          temperatureK: { type: "number", minimum: 0 },
          emissivity: { type: "number", minimum: 0, maximum: 1 },
          stefanBoltzmann: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["temperatureK", "emissivity", "stefanBoltzmann"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          blackbodyFlux: { type: "number" },
          emittedFlux: { type: "number" },
        },
        required: ["blackbodyFlux", "emittedFlux"],
      },
      ports: {
        inputs: [
          {
            id: "temperatureK",
            label: "Temperature K",
            required: true,
            valueType: { type: "number", unit: "K" },
          },
          {
            id: "emissivity",
            label: "Emissivity",
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
          {
            id: "blackbodyFlux",
            label: "Blackbody Flux",
            valueType: { type: "number" },
          },
          {
            id: "emittedFlux",
            label: "Emitted Flux",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = atmosphericEmissivityBlackbodyFluxTermTool.execute;
export default atmosphericEmissivityBlackbodyFluxTermTool;
