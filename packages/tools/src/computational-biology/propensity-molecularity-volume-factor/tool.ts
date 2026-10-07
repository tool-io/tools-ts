import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly molecularity: number;
  readonly systemVolume: number;
};
export type Output = { readonly volumeFactor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    molecularity: { type: "integer", minimum: 0 },
    systemVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["molecularity", "systemVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { volumeFactor: { type: "number" } },
  required: ["volumeFactor"],
} as const;
/** Calculate the explicit V^(1-molecularity) factor used in a supplied stochastic mass-action convention, excluding rate and combinatorial factors. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { molecularity, systemVolume } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(molecularity) &&
        molecularity >= 0 &&
        molecularity <= Number.MAX_SAFE_INTEGER,
      "molecularity",
    ),
      molecularity);
    (H.domain(
      Number.isFinite(systemVolume) && systemVolume > 0,
      "systemVolume",
    ),
      systemVolume);
    return { volumeFactor: Math.pow(systemVolume, 1 - molecularity) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { molecularity: 2, systemVolume: 4 },
  output: { volumeFactor: 0.25 },
} satisfies ToolExample<Input, Output>;
export const propensityMolecularityVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-biology", "computational biology", "biology"],
      keywords: ["computational biology", "biology"],
    },
    id: "computational-biology/propensity-molecularity-volume-factor",
    title: "Propensity Molecularity Volume Factor",
    description:
      "Calculate the explicit V^(1-molecularity) factor used in a supplied stochastic mass-action convention, excluding rate and combinatorial factors.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        molecularity: { type: "integer", minimum: 0 },
        systemVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["molecularity", "systemVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { volumeFactor: { type: "number" } },
      required: ["volumeFactor"],
    },
    ports: {
      inputs: [
        {
          id: "molecularity",
          label: "Molecularity",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "systemVolume",
          label: "System Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "volumeFactor",
          label: "Volume Factor",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = propensityMolecularityVolumeFactorTool.execute;
export default propensityMolecularityVolumeFactorTool;
