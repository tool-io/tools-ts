import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loadedMass: number;
  readonly tareMass: number;
  readonly blankCorrection: number;
  readonly sampledVolume: number;
};
export type Output = {
  readonly netMass: number;
  readonly concentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loadedMass: { type: "number" },
    tareMass: { type: "number" },
    blankCorrection: { type: "number" },
    sampledVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["loadedMass", "tareMass", "blankCorrection", "sampledVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number" },
    concentration: { type: "number" },
  },
  required: ["netMass", "concentration"],
} as const;
/** Retain signed blank-corrected net mass rather than clipping a negative measurement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loadedMass, tareMass, blankCorrection, sampledVolume } = request;
  const compute = (): Output => {
    H.positive(sampledVolume);
    return {
      netMass: loadedMass - tareMass - blankCorrection,
      concentration: (loadedMass - tareMass - blankCorrection) / sampledVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    loadedMass: 12,
    tareMass: 10,
    blankCorrection: 0.2,
    sampledVolume: 3,
  },
  output: { netMass: 1.8, concentration: 0.6 },
} satisfies ToolExample<Input, Output>;
export const particulateFilterTareMassBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-science/particulate-filter-tare-mass-balance",
    title: "Particulate Filter Tare Mass Balance Tool",
    description:
      "Retain signed blank-corrected net mass rather than clipping a negative measurement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loadedMass: { type: "number" },
        tareMass: { type: "number" },
        blankCorrection: { type: "number" },
        sampledVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["loadedMass", "tareMass", "blankCorrection", "sampledVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        concentration: { type: "number" },
      },
      required: ["netMass", "concentration"],
    },
    ports: {
      inputs: [
        {
          id: "loadedMass",
          label: "Loaded Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tareMass",
          label: "Tare Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankCorrection",
          label: "Blank Correction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledVolume",
          label: "Sampled Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
        {
          id: "concentration",
          label: "Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = particulateFilterTareMassBalanceTool.execute;
export default particulateFilterTareMassBalanceTool;
