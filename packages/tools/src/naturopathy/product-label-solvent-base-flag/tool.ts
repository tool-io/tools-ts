import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly labelTotalMass: number;
  readonly solventMass: number;
  readonly labeledComponentMass: number;
  readonly useSolventFree: boolean;
};
export type Output = {
  readonly denominatorMass: number;
  readonly componentFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    labelTotalMass: { type: "number", exclusiveMinimum: 0 },
    solventMass: { type: "number", minimum: 0 },
    labeledComponentMass: { type: "number", minimum: 0 },
    useSolventFree: { type: "boolean" },
  },
  required: [
    "labelTotalMass",
    "solventMass",
    "labeledComponentMass",
    "useSolventFree",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorMass: { type: "number" },
    componentFraction: { type: "number" },
  },
  required: ["denominatorMass", "componentFraction"],
} as const;
/** Compare supplied product-label mass bases without evaluating safety, efficacy or preparation methods. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { labelTotalMass, solventMass, labeledComponentMass, useSolventFree } =
    request;
  const compute = (): Output => {
    H.positive(labelTotalMass);
    H.domain(
      solventMass >= 0 &&
        solventMass < labelTotalMass &&
        labeledComponentMass >= 0 &&
        labeledComponentMass <= labelTotalMass - solventMass,
    );
    return {
      denominatorMass: labelTotalMass - (useSolventFree ? solventMass : 0),
      componentFraction:
        labeledComponentMass /
        (labelTotalMass - (useSolventFree ? solventMass : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    labelTotalMass: 100,
    solventMass: 60,
    labeledComponentMass: 20,
    useSolventFree: true,
  },
  output: { denominatorMass: 40, componentFraction: 0.5 },
} satisfies ToolExample<Input, Output>;
export const productLabelSolventBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "naturopathy/product-label-solvent-base-flag",
    title: "Product Label Solvent Base Flag Tool",
    description:
      "Compare supplied product-label mass bases without evaluating safety, efficacy or preparation methods.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        labelTotalMass: { type: "number", exclusiveMinimum: 0 },
        solventMass: { type: "number", minimum: 0 },
        labeledComponentMass: { type: "number", minimum: 0 },
        useSolventFree: { type: "boolean" },
      },
      required: [
        "labelTotalMass",
        "solventMass",
        "labeledComponentMass",
        "useSolventFree",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorMass: { type: "number" },
        componentFraction: { type: "number" },
      },
      required: ["denominatorMass", "componentFraction"],
    },
    ports: {
      inputs: [
        {
          id: "labelTotalMass",
          label: "Label Total Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solventMass",
          label: "Solvent Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "labeledComponentMass",
          label: "Labeled Component Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useSolventFree",
          label: "Use Solvent Free",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominatorMass",
          label: "Denominator Mass",
          valueType: { type: "number" },
        },
        {
          id: "componentFraction",
          label: "Component Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = productLabelSolventBaseFlagTool.execute;
export default productLabelSolventBaseFlagTool;
