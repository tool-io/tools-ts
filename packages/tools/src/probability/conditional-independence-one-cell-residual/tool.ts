import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly joint: number;
  readonly leftGiven: number;
  readonly rightGiven: number;
  readonly conditioningMass: number;
};
export type Output = { readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    joint: { type: "number", minimum: 0, maximum: 1 },
    leftGiven: { type: "number", minimum: 0, maximum: 1 },
    rightGiven: { type: "number", minimum: 0, maximum: 1 },
    conditioningMass: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["joint", "leftGiven", "rightGiven", "conditioningMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residual: { type: "number" } },
  required: ["residual"],
} as const;
/** Compute conditional independence one cell residual from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { joint, leftGiven, rightGiven, conditioningMass } = input;
  const compute = (): Output => {
    probability(joint);
    probability(leftGiven);
    probability(rightGiven);
    probability(conditioningMass);
    return { residual: joint - conditioningMass * leftGiven * rightGiven };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    joint: 0.125,
    leftGiven: 0.5,
    rightGiven: 0.5,
    conditioningMass: 0.5,
  },
  output: { residual: 0 },
} satisfies ToolExample<Input, Output>;
export const conditionalIndependenceOneCellResidualTool =
  defineSchemaCalculation<Input, Output>({
    id: "probability/conditional-independence-one-cell-residual",
    title: "Conditional Independence One Cell Residual Tool",
    description:
      "Compute conditional independence one cell residual from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "joint",
          label: "Joint",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "leftGiven",
          label: "Left Given",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rightGiven",
          label: "Right Given",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "conditioningMass",
          label: "Conditioning Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  });
export const run = conditionalIndependenceOneCellResidualTool.execute;
export default conditionalIndependenceOneCellResidualTool;
