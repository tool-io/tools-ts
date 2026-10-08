import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly consumedMass: number;
  readonly packageMass: number;
  readonly labeledServingMass: number;
};
export type Output = {
  readonly packageFraction: number;
  readonly labeledServings: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    consumedMass: { type: "number", minimum: 0 },
    packageMass: { type: "number", exclusiveMinimum: 0 },
    labeledServingMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["consumedMass", "packageMass", "labeledServingMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packageFraction: { type: "number" },
    labeledServings: { type: "number" },
  },
  required: ["packageFraction", "labeledServings"],
} as const;
/** Express supplied consumed food mass as package fraction and labeled serving count, permitting multiple packages. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { consumedMass, packageMass, labeledServingMass } = request;
  const compute = (): Output => {
    (H.domain(Number.isFinite(packageMass) && packageMass > 0, "packageMass"),
      packageMass);
    (H.domain(
      Number.isFinite(labeledServingMass) && labeledServingMass > 0,
      "labeledServingMass",
    ),
      labeledServingMass);
    H.domain(consumedMass >= 0, "consumedMass");
    return {
      packageFraction: consumedMass / packageMass,
      labeledServings: consumedMass / labeledServingMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { consumedMass: 150, packageMass: 300, labeledServingMass: 50 },
  output: { packageFraction: 0.5, labeledServings: 3 },
} satisfies ToolExample<Input, Output>;
export const foodPackageMultipleServingFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dietetics/food-package-multiple-serving-fraction",
    title: "Food Package Multiple Serving Fraction Tool",
    description:
      "Express supplied consumed food mass as package fraction and labeled serving count, permitting multiple packages.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        consumedMass: { type: "number", minimum: 0 },
        packageMass: { type: "number", exclusiveMinimum: 0 },
        labeledServingMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["consumedMass", "packageMass", "labeledServingMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packageFraction: { type: "number" },
        labeledServings: { type: "number" },
      },
      required: ["packageFraction", "labeledServings"],
    },
    ports: {
      inputs: [
        {
          id: "consumedMass",
          label: "Consumed Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "packageMass",
          label: "Package Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labeledServingMass",
          label: "Labeled Serving Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "packageFraction",
          label: "Package Fraction",
          valueType: { type: "number" },
        },
        {
          id: "labeledServings",
          label: "Labeled Servings",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = foodPackageMultipleServingFractionTool.execute;
export default foodPackageMultipleServingFractionTool;
