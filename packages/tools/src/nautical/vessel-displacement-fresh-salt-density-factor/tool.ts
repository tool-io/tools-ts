import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldDisplacement: number;
  readonly oldDensity: number;
  readonly newDensity: number;
};
export type Output = {
  readonly newDisplacement: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldDisplacement: { type: "number", minimum: 0 },
    oldDensity: { type: "number", exclusiveMinimum: 0 },
    newDensity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["oldDisplacement", "oldDensity", "newDensity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newDisplacement: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["newDisplacement", "ratio"],
} as const;
/** Rescale displaced mass at an unchanged immersed volume; equilibrium draft adjustment is excluded. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldDisplacement, oldDensity, newDensity } = request;
  const compute = (): Output => {
    H.domain(oldDisplacement >= 0);
    H.positive(oldDensity);
    H.positive(newDensity);
    const ratio = newDensity / oldDensity;
    return { newDisplacement: oldDisplacement * ratio, ratio };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldDisplacement: 1000, oldDensity: 1000, newDensity: 1025 },
  output: { newDisplacement: 1025, ratio: 1.025 },
} satisfies ToolExample<Input, Output>;
export const vesselDisplacementFreshSaltDensityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nautical/vessel-displacement-fresh-salt-density-factor",
      title: "Vessel Displacement Fresh Salt Density Factor Tool",
      description:
        "Rescale displaced mass at an unchanged immersed volume; equilibrium draft adjustment is excluded.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oldDisplacement: { type: "number", minimum: 0 },
          oldDensity: { type: "number", exclusiveMinimum: 0 },
          newDensity: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["oldDisplacement", "oldDensity", "newDensity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          newDisplacement: { type: "number" },
          ratio: { type: "number" },
        },
        required: ["newDisplacement", "ratio"],
      },
      ports: {
        inputs: [
          {
            id: "oldDisplacement",
            label: "Old Displacement",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "oldDensity",
            label: "Old Density",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newDensity",
            label: "New Density",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "newDisplacement",
            label: "New Displacement",
            valueType: { type: "number" },
          },
          { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = vesselDisplacementFreshSaltDensityFactorTool.execute;
export default vesselDisplacementFreshSaltDensityFactorTool;
