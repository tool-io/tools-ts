import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bulkVolume: number;
  readonly porosity: number;
  readonly saturation: number;
};
export type Output = {
  readonly poreVolume: number;
  readonly liquidVolume: number;
  readonly airVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bulkVolume: { type: "number", minimum: 0 },
    porosity: { type: "number", minimum: 0, maximum: 1 },
    saturation: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["bulkVolume", "porosity", "saturation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    poreVolume: { type: "number" },
    liquidVolume: { type: "number" },
    airVolume: { type: "number" },
  },
  required: ["poreVolume", "liquidVolume", "airVolume"],
} as const;
/** Calculate remediation soil volume porosity factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bulkVolume, porosity, saturation } = request;
  const compute = (): Output => {
    H.domain(bulkVolume >= 0);
    H.probability(porosity);
    H.probability(saturation);
    return {
      poreVolume: bulkVolume * porosity,
      liquidVolume: bulkVolume * porosity * saturation,
      airVolume: bulkVolume * porosity * (1 - saturation),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bulkVolume: 100, porosity: 0.4, saturation: 0.5 },
  output: { poreVolume: 40, liquidVolume: 20, airVolume: 20 },
} satisfies ToolExample<Input, Output>;
export const remediationSoilVolumePorosityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioremediation/remediation-soil-volume-porosity-factor",
      title: "Remediation Soil Volume Porosity Factor Tool",
      description:
        "Calculate remediation soil volume porosity factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          bulkVolume: { type: "number", minimum: 0 },
          porosity: { type: "number", minimum: 0, maximum: 1 },
          saturation: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["bulkVolume", "porosity", "saturation"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          poreVolume: { type: "number" },
          liquidVolume: { type: "number" },
          airVolume: { type: "number" },
        },
        required: ["poreVolume", "liquidVolume", "airVolume"],
      },
      ports: {
        inputs: [
          {
            id: "bulkVolume",
            label: "Bulk Volume",
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
            id: "saturation",
            label: "Saturation",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "poreVolume",
            label: "Pore Volume",
            valueType: { type: "number" },
          },
          {
            id: "liquidVolume",
            label: "Liquid Volume",
            valueType: { type: "number" },
          },
          {
            id: "airVolume",
            label: "Air Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = remediationSoilVolumePorosityFactorTool.execute;
export default remediationSoilVolumePorosityFactorTool;
