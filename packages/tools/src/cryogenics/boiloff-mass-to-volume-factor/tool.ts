import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lostMass: number;
  readonly suppliedLiquidDensity: number;
  readonly suppliedVaporDensity: number;
};
export type Output = {
  readonly liquidVolumeEquivalent: number;
  readonly vaporVolumeEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostMass: { type: "number", minimum: 0 },
    suppliedLiquidDensity: { type: "number", exclusiveMinimum: 0 },
    suppliedVaporDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["lostMass", "suppliedLiquidDensity", "suppliedVaporDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    liquidVolumeEquivalent: { type: "number" },
    vaporVolumeEquivalent: { type: "number" },
  },
  required: ["liquidVolumeEquivalent", "vaporVolumeEquivalent"],
} as const;
/** Convert supplied lost mass into two explicit density-state equivalents, without storage or vent-system design. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lostMass, suppliedLiquidDensity, suppliedVaporDensity } = request;
  const compute = (): Output => {
    H.domain(lostMass >= 0);
    H.positive(suppliedLiquidDensity);
    H.positive(suppliedVaporDensity);
    return {
      liquidVolumeEquivalent: lostMass / suppliedLiquidDensity,
      vaporVolumeEquivalent: lostMass / suppliedVaporDensity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lostMass: 2, suppliedLiquidDensity: 4, suppliedVaporDensity: 0.5 },
  output: { liquidVolumeEquivalent: 0.5, vaporVolumeEquivalent: 4 },
} satisfies ToolExample<Input, Output>;
export const boiloffMassToVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cryogenics/boiloff-mass-to-volume-factor",
    title: "Boiloff Mass To Volume Factor Tool",
    description:
      "Convert supplied lost mass into two explicit density-state equivalents, without storage or vent-system design.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lostMass: { type: "number", minimum: 0 },
        suppliedLiquidDensity: { type: "number", exclusiveMinimum: 0 },
        suppliedVaporDensity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["lostMass", "suppliedLiquidDensity", "suppliedVaporDensity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        liquidVolumeEquivalent: { type: "number" },
        vaporVolumeEquivalent: { type: "number" },
      },
      required: ["liquidVolumeEquivalent", "vaporVolumeEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "lostMass",
          label: "Lost Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLiquidDensity",
          label: "Supplied Liquid Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedVaporDensity",
          label: "Supplied Vapor Density",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "liquidVolumeEquivalent",
          label: "Liquid Volume Equivalent",
          valueType: { type: "number" },
        },
        {
          id: "vaporVolumeEquivalent",
          label: "Vapor Volume Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = boiloffMassToVolumeFactorTool.execute;
export default boiloffMassToVolumeFactorTool;
