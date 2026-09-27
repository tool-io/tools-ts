import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalBurden: number;
  readonly weight: number;
  readonly totalWeight: number;
  readonly cap: number;
};
export type Output = {
  readonly uncapped: number;
  readonly allocated: number;
  readonly excess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalBurden: { type: "number", minimum: 0 },
    weight: { type: "number", minimum: 0 },
    totalWeight: { type: "number", exclusiveMinimum: 0 },
    cap: { type: "number", minimum: 0 },
  },
  required: ["totalBurden", "weight", "totalWeight", "cap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncapped: { type: "number" },
    allocated: { type: "number" },
    excess: { type: "number" },
  },
  required: ["uncapped", "allocated", "excess"],
} as const;
/** Calculate proportional burden cap one party from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalBurden, weight, totalWeight, cap } = request;
  const compute = (): Output => {
    H.domain(totalBurden >= 0 && weight >= 0 && cap >= 0);
    H.positive(totalWeight);
    H.domain(weight <= totalWeight);
    return {
      uncapped: (totalBurden * weight) / totalWeight,
      allocated: Math.min(cap, (totalBurden * weight) / totalWeight),
      excess: Math.max(0, (totalBurden * weight) / totalWeight - cap),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalBurden: 100, weight: 3, totalWeight: 10, cap: 25 },
  output: { uncapped: 30, allocated: 25, excess: 5 },
} satisfies ToolExample<Input, Output>;
export const proportionalBurdenCapOnePartyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethics/proportional-burden-cap-one-party",
    title: "Proportional Burden Cap One Party Tool",
    description:
      "Calculate proportional burden cap one party from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalBurden: { type: "number", minimum: 0 },
        weight: { type: "number", minimum: 0 },
        totalWeight: { type: "number", exclusiveMinimum: 0 },
        cap: { type: "number", minimum: 0 },
      },
      required: ["totalBurden", "weight", "totalWeight", "cap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncapped: { type: "number" },
        allocated: { type: "number" },
        excess: { type: "number" },
      },
      required: ["uncapped", "allocated", "excess"],
    },
    ports: {
      inputs: [
        {
          id: "totalBurden",
          label: "Total Burden",
          required: true,
          valueType: { type: "number" },
        },
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
          id: "cap",
          label: "Cap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "uncapped", label: "Uncapped", valueType: { type: "number" } },
        { id: "allocated", label: "Allocated", valueType: { type: "number" } },
        { id: "excess", label: "Excess", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = proportionalBurdenCapOnePartyTool.execute;
export default proportionalBurdenCapOnePartyTool;
