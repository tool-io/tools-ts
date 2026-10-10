import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalMaterial: number;
  readonly allocatedPortion: number;
};
export type Output = {
  readonly portionFraction: number;
  readonly unallocatedMaterial: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMaterial: { type: "number", exclusiveMinimum: 0 },
    allocatedPortion: { type: "number", minimum: 0 },
  },
  required: ["totalMaterial", "allocatedPortion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    portionFraction: { type: "number" },
    unallocatedMaterial: { type: "number" },
  },
  required: ["portionFraction", "unallocatedMaterial"],
} as const;
/** Calculate an explicit session-material allocation on compatible quantity units without prescribing activities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalMaterial, allocatedPortion } = request;
  const compute = (): Output => {
    (H.domain(totalMaterial > 0, "totalMaterial"), totalMaterial);
    H.domain(
      allocatedPortion >= 0 && allocatedPortion <= totalMaterial,
      "allocatedPortion",
    );
    return {
      portionFraction: allocatedPortion / totalMaterial,
      unallocatedMaterial: totalMaterial - allocatedPortion,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalMaterial: 200, allocatedPortion: 50 },
  output: { portionFraction: 0.25, unallocatedMaterial: 150 },
} satisfies ToolExample<Input, Output>;
export const occupationalSessionMaterialPortionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "occupational-therapy",
        "occupational therapy",
        "health and medicine",
      ],
      keywords: ["occupational therapy", "health and medicine"],
    },
    id: "occupational-therapy/occupational-session-material-portion",
    title: "Occupational Session Material Portion",
    description:
      "Calculate an explicit session-material allocation on compatible quantity units without prescribing activities.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMaterial: { type: "number", exclusiveMinimum: 0 },
        allocatedPortion: { type: "number", minimum: 0 },
      },
      required: ["totalMaterial", "allocatedPortion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        portionFraction: { type: "number" },
        unallocatedMaterial: { type: "number" },
      },
      required: ["portionFraction", "unallocatedMaterial"],
    },
    ports: {
      inputs: [
        {
          id: "totalMaterial",
          label: "Total Material",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "allocatedPortion",
          label: "Allocated Portion",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "portionFraction",
          label: "Portion Fraction",
          valueType: { type: "number" },
        },
        {
          id: "unallocatedMaterial",
          label: "Unallocated Material",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = occupationalSessionMaterialPortionTool.execute;
export default occupationalSessionMaterialPortionTool;
