import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly crucibleMass: number;
  readonly loadedMass: number;
  readonly ignitedMass: number;
};
export type Output = {
  readonly sampleMass: number;
  readonly massLoss: number;
  readonly loiPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crucibleMass: { type: "number" },
    loadedMass: { type: "number" },
    ignitedMass: { type: "number" },
  },
  required: ["crucibleMass", "loadedMass", "ignitedMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleMass: { type: "number" },
    massLoss: { type: "number" },
    loiPercent: { type: "number" },
  },
  required: ["sampleMass", "massLoss", "loiPercent"],
} as const;
/** Signed gravimetric loss on ignition; oxidation-related mass gain appears as negative LOI. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { crucibleMass, loadedMass, ignitedMass } = request;
  const compute = (): Output => {
    H.domain(loadedMass > crucibleMass && ignitedMass >= crucibleMass);
    return {
      sampleMass: loadedMass - crucibleMass,
      massLoss: loadedMass - ignitedMass,
      loiPercent:
        (100 * (loadedMass - ignitedMass)) / (loadedMass - crucibleMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { crucibleMass: 20, loadedMass: 30, ignitedMass: 29 },
  output: { sampleMass: 10, massLoss: 1, loiPercent: 10 },
} satisfies ToolExample<Input, Output>;
export const geochemicalLossOnIgnitionBasisTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/geochemical-loss-on-ignition-basis",
    title: "Geochemical Loss On Ignition Basis Tool",
    description:
      "Signed gravimetric loss on ignition; oxidation-related mass gain appears as negative LOI.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        crucibleMass: { type: "number" },
        loadedMass: { type: "number" },
        ignitedMass: { type: "number" },
      },
      required: ["crucibleMass", "loadedMass", "ignitedMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleMass: { type: "number" },
        massLoss: { type: "number" },
        loiPercent: { type: "number" },
      },
      required: ["sampleMass", "massLoss", "loiPercent"],
    },
    ports: {
      inputs: [
        {
          id: "crucibleMass",
          label: "Crucible Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "loadedMass",
          label: "Loaded Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ignitedMass",
          label: "Ignited Mass",
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
        { id: "massLoss", label: "Mass Loss", valueType: { type: "number" } },
        {
          id: "loiPercent",
          label: "Loi Percent",
          valueType: { type: "number", unit: "%" },
        },
      ],
    },
  },
  calculate,
});
export const run = geochemicalLossOnIgnitionBasisTool.execute;
export default geochemicalLossOnIgnitionBasisTool;
