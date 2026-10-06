import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly loadedFilterMass: number;
  readonly unloadedFilterMass: number;
  readonly blankMassGain: number;
};
export type Output = {
  readonly sampleMass: number;
  readonly uncorrectedGain: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loadedFilterMass: { type: "number" },
    unloadedFilterMass: { type: "number" },
    blankMassGain: { type: "number" },
  },
  required: ["loadedFilterMass", "unloadedFilterMass", "blankMassGain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleMass: { type: "number" },
    uncorrectedGain: { type: "number" },
  },
  required: ["sampleMass", "uncorrectedGain"],
} as const;
/** Subtract a matched blank mass gain from a filter’s measured loaded-minus-unloaded mass in common units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { loadedFilterMass, unloadedFilterMass, blankMassGain } = request;
  const compute = (): Output => {
    return {
      sampleMass: loadedFilterMass - unloadedFilterMass - blankMassGain,
      uncorrectedGain: loadedFilterMass - unloadedFilterMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    loadedFilterMass: 102.5,
    unloadedFilterMass: 100,
    blankMassGain: 0.5,
  },
  output: { sampleMass: 2, uncorrectedGain: 2.5 },
} satisfies ToolExample<Input, Output>;
export const aerosolBlankMassSubtractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-chemistry", "atmospheric chemistry", "chemistry"],
      keywords: ["atmospheric chemistry", "chemistry"],
    },
    id: "atmospheric-chemistry/aerosol-blank-mass-subtraction",
    title: "Aerosol Blank Mass Subtraction",
    description:
      "Subtract a matched blank mass gain from a filter’s measured loaded-minus-unloaded mass in common units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loadedFilterMass: { type: "number" },
        unloadedFilterMass: { type: "number" },
        blankMassGain: { type: "number" },
      },
      required: ["loadedFilterMass", "unloadedFilterMass", "blankMassGain"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleMass: { type: "number" },
        uncorrectedGain: { type: "number" },
      },
      required: ["sampleMass", "uncorrectedGain"],
    },
    ports: {
      inputs: [
        {
          id: "loadedFilterMass",
          label: "Loaded Filter Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unloadedFilterMass",
          label: "Unloaded Filter Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankMassGain",
          label: "Blank Mass Gain",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sampleMass",
          label: "Sample Mass",
          valueType: { type: "number" },
        },
        {
          id: "uncorrectedGain",
          label: "Uncorrected Gain",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = aerosolBlankMassSubtractionTool.execute;
export default aerosolBlankMassSubtractionTool;
