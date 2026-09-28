import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly solidVolume: number;
  readonly porosity: number;
  readonly sedimentDensity: number;
};
export type Output = {
  readonly bulkVolume: number;
  readonly solidMass: number;
  readonly poreVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidVolume: { type: "number", minimum: 0 },
    porosity: { type: "number", minimum: 0, exclusiveMaximum: 1 },
    sedimentDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["solidVolume", "porosity", "sedimentDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bulkVolume: { type: "number" },
    solidMass: { type: "number" },
    poreVolume: { type: "number" },
  },
  required: ["bulkVolume", "solidMass", "poreVolume"],
} as const;
/** Calculate sediment transport porosity volume factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { solidVolume, porosity, sedimentDensity } = request;
  const compute = (): Output => {
    H.domain(solidVolume >= 0 && porosity >= 0 && porosity < 1);
    H.positive(sedimentDensity);
    return {
      bulkVolume: solidVolume / (1 - porosity),
      solidMass: solidVolume * sedimentDensity,
      poreVolume: (solidVolume * porosity) / (1 - porosity),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { solidVolume: 60, porosity: 0.4, sedimentDensity: 2600 },
  output: { bulkVolume: 100, solidMass: 156000, poreVolume: 40 },
} satisfies ToolExample<Input, Output>;
export const sedimentTransportPorosityVolumeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geomorphology/sediment-transport-porosity-volume-factor",
      title: "Sediment Transport Porosity Volume Factor Tool",
      description:
        "Calculate sediment transport porosity volume factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          solidVolume: { type: "number", minimum: 0 },
          porosity: { type: "number", minimum: 0, exclusiveMaximum: 1 },
          sedimentDensity: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["solidVolume", "porosity", "sedimentDensity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bulkVolume: { type: "number" },
          solidMass: { type: "number" },
          poreVolume: { type: "number" },
        },
        required: ["bulkVolume", "solidMass", "poreVolume"],
      },
      ports: {
        inputs: [
          {
            id: "solidVolume",
            label: "Solid Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "porosity",
            label: "Porosity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sedimentDensity",
            label: "Sediment Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "bulkVolume",
            label: "Bulk Volume",
            valueType: { type: "number" },
          },
          {
            id: "solidMass",
            label: "Solid Mass",
            valueType: { type: "number" },
          },
          {
            id: "poreVolume",
            label: "Pore Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = sedimentTransportPorosityVolumeFactorTool.execute;
export default sedimentTransportPorosityVolumeFactorTool;
