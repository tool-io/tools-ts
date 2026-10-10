import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly jointMass: number;
  readonly firstMarginalMass: number;
  readonly secondMarginalMass: number;
};
export type Output = {
  readonly independentReferenceMass: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jointMass: { type: "number" },
    firstMarginalMass: { type: "number", minimum: 0, maximum: 1 },
    secondMarginalMass: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["jointMass", "firstMarginalMass", "secondMarginalMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    independentReferenceMass: { type: "number" },
    residual: { type: "number" },
  },
  required: ["independentReferenceMass", "residual"],
} as const;
/** Compare an explicit feasible joint event mass with the product of its supplied marginals without claiming statistical independence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { jointMass, firstMarginalMass, secondMarginalMass } = request;
  const compute = (): Output => {
    (H.domain(
      firstMarginalMass >= 0 && firstMarginalMass <= 1,
      "firstMarginalMass",
    ),
      firstMarginalMass);
    (H.domain(
      secondMarginalMass >= 0 && secondMarginalMass <= 1,
      "secondMarginalMass",
    ),
      secondMarginalMass);
    H.domain(
      jointMass >= Math.max(0, firstMarginalMass + secondMarginalMass - 1) &&
        jointMass <= Math.min(firstMarginalMass, secondMarginalMass),
      "jointMass",
    );
    return {
      independentReferenceMass: firstMarginalMass * secondMarginalMass,
      residual: jointMass - firstMarginalMass * secondMarginalMass,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { jointMass: 0.2, firstMarginalMass: 0.5, secondMarginalMass: 0.3 },
  output: { independentReferenceMass: 0.15, residual: 0.05000000000000002 },
} satisfies ToolExample<Input, Output>;
export const jointMassIndependentReferenceResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["information", "information theory", "computer science"],
        keywords: ["information theory", "computer science"],
      },
      id: "information/joint-mass-independent-reference-residual",
      title: "Joint Mass Independent Reference Residual",
      description:
        "Compare an explicit feasible joint event mass with the product of its supplied marginals without claiming statistical independence.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          jointMass: { type: "number" },
          firstMarginalMass: { type: "number", minimum: 0, maximum: 1 },
          secondMarginalMass: { type: "number", minimum: 0, maximum: 1 },
        },
        required: ["jointMass", "firstMarginalMass", "secondMarginalMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          independentReferenceMass: { type: "number" },
          residual: { type: "number" },
        },
        required: ["independentReferenceMass", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "jointMass",
            label: "Joint Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstMarginalMass",
            label: "First Marginal Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondMarginalMass",
            label: "Second Marginal Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "independentReferenceMass",
            label: "Independent Reference Mass",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = jointMassIndependentReferenceResidualTool.execute;
export default jointMassIndependentReferenceResidualTool;
