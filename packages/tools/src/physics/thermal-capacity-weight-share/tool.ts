import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly mass: number;
  readonly specificHeat: number;
  readonly totalCapacity: number;
};
export type Output = { readonly capacity: number; readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mass: { type: "number", minimum: 0 },
    specificHeat: { type: "number", minimum: 0 },
    totalCapacity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["mass", "specificHeat", "totalCapacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { capacity: { type: "number" }, share: { type: "number" } },
  required: ["capacity", "share"],
} as const;
/** Calculate thermal capacity weight share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { mass, specificHeat, totalCapacity } = request;
  const compute = (): Output => {
    H.domain(mass >= 0 && specificHeat >= 0);
    H.positive(totalCapacity);
    H.domain(mass * specificHeat <= totalCapacity);
    return {
      capacity: mass * specificHeat,
      share: (mass * specificHeat) / totalCapacity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { mass: 2, specificHeat: 4, totalCapacity: 20 },
  output: { capacity: 8, share: 0.4 },
} satisfies ToolExample<Input, Output>;
export const thermalCapacityWeightShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/thermal-capacity-weight-share",
    title: "Thermal Capacity Weight Share Tool",
    description:
      "Calculate thermal capacity weight share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mass: { type: "number", minimum: 0 },
        specificHeat: { type: "number", minimum: 0 },
        totalCapacity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["mass", "specificHeat", "totalCapacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { capacity: { type: "number" }, share: { type: "number" } },
      required: ["capacity", "share"],
    },
    ports: {
      inputs: [
        {
          id: "mass",
          label: "Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "specificHeat",
          label: "Specific Heat",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalCapacity",
          label: "Total Capacity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "capacity", label: "Capacity", valueType: { type: "number" } },
        { id: "share", label: "Share", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = thermalCapacityWeightShareTool.execute;
export default thermalCapacityWeightShareTool;
