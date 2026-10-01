import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly solidDensity: number;
  readonly measuredBulkDensity: number;
  readonly fluidDensity: number;
  readonly filledFraction: number;
};
export type Output = {
  readonly voidFraction: number;
  readonly filledBulkDensity: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidDensity: { type: "number", exclusiveMinimum: 0 },
    measuredBulkDensity: { type: "number", minimum: 0 },
    fluidDensity: { type: "number", minimum: 0 },
    filledFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "solidDensity",
    "measuredBulkDensity",
    "fluidDensity",
    "filledFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voidFraction: { type: "number" },
    filledBulkDensity: { type: "number" },
  },
  required: ["voidFraction", "filledBulkDensity"],
} as const;
/** Dry two-phase model porosity and partial pore-fluid fill, without inferring clinical bone quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { solidDensity, measuredBulkDensity, fluidDensity, filledFraction } =
    request;
  const compute = (): Output => {
    H.positive(solidDensity);
    H.domain(
      measuredBulkDensity >= 0 &&
        measuredBulkDensity <= solidDensity &&
        fluidDensity >= 0,
    );
    H.probability(filledFraction);
    return {
      voidFraction: 1 - measuredBulkDensity / solidDensity,
      filledBulkDensity:
        measuredBulkDensity +
        (1 - measuredBulkDensity / solidDensity) *
          fluidDensity *
          filledFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    solidDensity: 2000,
    measuredBulkDensity: 1500,
    fluidDensity: 1000,
    filledFraction: 0.5,
  },
  output: { voidFraction: 0.25, filledBulkDensity: 1625 },
} satisfies ToolExample<Input, Output>;
export const boneModelPorosityDensityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "orthopedics/bone-model-porosity-density-factor",
    title: "Bone Model Porosity Density Factor Tool",
    description:
      "Dry two-phase model porosity and partial pore-fluid fill, without inferring clinical bone quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solidDensity: { type: "number", exclusiveMinimum: 0 },
        measuredBulkDensity: { type: "number", minimum: 0 },
        fluidDensity: { type: "number", minimum: 0 },
        filledFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "solidDensity",
        "measuredBulkDensity",
        "fluidDensity",
        "filledFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        voidFraction: { type: "number" },
        filledBulkDensity: { type: "number" },
      },
      required: ["voidFraction", "filledBulkDensity"],
    },
    ports: {
      inputs: [
        {
          id: "solidDensity",
          label: "Solid Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredBulkDensity",
          label: "Measured Bulk Density",
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
          id: "filledFraction",
          label: "Filled Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "voidFraction",
          label: "Void Fraction",
          valueType: { type: "number" },
        },
        {
          id: "filledBulkDensity",
          label: "Filled Bulk Density",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boneModelPorosityDensityFactorTool.execute;
export default boneModelPorosityDensityFactorTool;
