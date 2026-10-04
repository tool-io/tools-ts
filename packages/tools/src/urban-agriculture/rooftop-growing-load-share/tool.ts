import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryMaterialMass: number;
  readonly waterMass: number;
  readonly containerMass: number;
  readonly area: number;
  readonly suppliedLoadBudget: number;
};
export type Output = {
  readonly totalMass: number;
  readonly massPerArea: number;
  readonly budgetShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMaterialMass: { type: "number", minimum: 0 },
    waterMass: { type: "number", minimum: 0 },
    containerMass: { type: "number", minimum: 0 },
    area: { type: "number", exclusiveMinimum: 0 },
    suppliedLoadBudget: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "dryMaterialMass",
    "waterMass",
    "containerMass",
    "area",
    "suppliedLoadBudget",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMass: { type: "number" },
    massPerArea: { type: "number" },
    budgetShare: { type: "number" },
  },
  required: ["totalMass", "massPerArea", "budgetShare"],
} as const;
/** Account for explicit rooftop mass per area against a supplied budget; no structural load capacity or safety assessment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    dryMaterialMass,
    waterMass,
    containerMass,
    area,
    suppliedLoadBudget,
  } = request;
  const compute = (): Output => {
    H.domain(dryMaterialMass >= 0 && waterMass >= 0 && containerMass >= 0);
    H.positive(area);
    H.positive(suppliedLoadBudget);
    return (() => {
      const totalMass = dryMaterialMass + waterMass + containerMass,
        massPerArea = totalMass / area;
      return {
        totalMass,
        massPerArea,
        budgetShare: massPerArea / suppliedLoadBudget,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dryMaterialMass: 20,
    waterMass: 30,
    containerMass: 10,
    area: 10,
    suppliedLoadBudget: 12,
  },
  output: { totalMass: 60, massPerArea: 6, budgetShare: 0.5 },
} satisfies ToolExample<Input, Output>;
export const rooftopGrowingLoadShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/rooftop-growing-load-share",
    title: "Rooftop Growing Load Share Tool",
    description:
      "Account for explicit rooftop mass per area against a supplied budget; no structural load capacity or safety assessment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMaterialMass: { type: "number", minimum: 0 },
        waterMass: { type: "number", minimum: 0 },
        containerMass: { type: "number", minimum: 0 },
        area: { type: "number", exclusiveMinimum: 0 },
        suppliedLoadBudget: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "dryMaterialMass",
        "waterMass",
        "containerMass",
        "area",
        "suppliedLoadBudget",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMass: { type: "number" },
        massPerArea: { type: "number" },
        budgetShare: { type: "number" },
      },
      required: ["totalMass", "massPerArea", "budgetShare"],
    },
    ports: {
      inputs: [
        {
          id: "dryMaterialMass",
          label: "Dry Material Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "waterMass",
          label: "Water Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "containerMass",
          label: "Container Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedLoadBudget",
          label: "Supplied Load Budget",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "totalMass", label: "Total Mass", valueType: { type: "number" } },
        {
          id: "massPerArea",
          label: "Mass Per Area",
          valueType: { type: "number" },
        },
        {
          id: "budgetShare",
          label: "Budget Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = rooftopGrowingLoadShareTool.execute;
export default rooftopGrowingLoadShareTool;
