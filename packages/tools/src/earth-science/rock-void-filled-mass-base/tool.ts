import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryMass: number;
  readonly filledMass: number;
  readonly fluidDensity: number;
  readonly bulkVolume: number;
};
export type Output = {
  readonly voidVolume: number;
  readonly voidFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number", minimum: 0 },
    filledMass: { type: "number" },
    fluidDensity: { type: "number", exclusiveMinimum: 0 },
    bulkVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dryMass", "filledMass", "fluidDensity", "bulkVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voidVolume: { type: "number" },
    voidFraction: { type: "number" },
  },
  required: ["voidVolume", "voidFraction"],
} as const;
/** Ideal fully filled connected-void mass balance with supplied fluid density, not total porosity from incomplete saturation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryMass, filledMass, fluidDensity, bulkVolume } = request;
  const compute = (): Output => {
    H.positive(fluidDensity);
    H.positive(bulkVolume);
    H.domain(
      dryMass >= 0 &&
        filledMass >= dryMass &&
        (filledMass - dryMass) / fluidDensity <= bulkVolume,
    );
    return {
      voidVolume: (filledMass - dryMass) / fluidDensity,
      voidFraction: (filledMass - dryMass) / fluidDensity / bulkVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryMass: 200, filledMass: 220, fluidDensity: 1, bulkVolume: 100 },
  output: { voidVolume: 20, voidFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const rockVoidFilledMassBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "earth-science/rock-void-filled-mass-base",
    title: "Rock Void Filled Mass Base Tool",
    description:
      "Ideal fully filled connected-void mass balance with supplied fluid density, not total porosity from incomplete saturation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number", minimum: 0 },
        filledMass: { type: "number" },
        fluidDensity: { type: "number", exclusiveMinimum: 0 },
        bulkVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dryMass", "filledMass", "fluidDensity", "bulkVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voidVolume: { type: "number" },
        voidFraction: { type: "number" },
      },
      required: ["voidVolume", "voidFraction"],
    },
    ports: {
      inputs: [
        {
          id: "dryMass",
          label: "Dry Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "filledMass",
          label: "Filled Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fluidDensity",
          label: "Fluid Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "bulkVolume",
          label: "Bulk Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voidVolume",
          label: "Void Volume",
          valueType: { type: "number" },
        },
        {
          id: "voidFraction",
          label: "Void Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rockVoidFilledMassBaseTool.execute;
export default rockVoidFilledMassBaseTool;
