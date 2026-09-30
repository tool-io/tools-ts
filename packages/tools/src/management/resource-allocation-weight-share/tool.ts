import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weight: number;
  readonly totalWeight: number;
  readonly available: number;
};
export type Output = { readonly share: number; readonly allocation: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weight: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
    available: { type: "number", minimum: 0 },
  },
  required: ["weight", "totalWeight", "available"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" }, allocation: { type: "number" } },
  required: ["share", "allocation"],
} as const;
/** Calculate resource allocation weight share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weight, totalWeight, available } = request;
  const compute = (): Output => {
    H.positive(totalWeight);
    H.domain(weight >= 0 && weight <= totalWeight && available >= 0);
    return {
      share: weight / totalWeight,
      allocation: available * (weight / totalWeight),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weight: 3, totalWeight: 12, available: 80 },
  output: { share: 0.25, allocation: 20 },
} satisfies ToolExample<Input, Output>;
export const resourceAllocationWeightShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/resource-allocation-weight-share",
    title: "Resource Allocation Weight Share Tool",
    description:
      "Calculate resource allocation weight share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weight: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
        available: { type: "number", minimum: 0 },
      },
      required: ["weight", "totalWeight", "available"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" }, allocation: { type: "number" } },
      required: ["share", "allocation"],
    },
    ports: {
      inputs: [
        {
          id: "weight",
          label: "Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWeight",
          label: "Total Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "available",
          label: "Available",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "share", label: "Share", valueType: { type: "number" } },
        {
          id: "allocation",
          label: "Allocation",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = resourceAllocationWeightShareTool.execute;
export default resourceAllocationWeightShareTool;
