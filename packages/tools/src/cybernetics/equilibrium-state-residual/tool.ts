import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stateDerivative: number;
  readonly suppliedTolerance: number;
};
export type Output = {
  readonly absoluteResidual: number;
  readonly withinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stateDerivative: { type: "number" },
    suppliedTolerance: { type: "number", minimum: 0 },
  },
  required: ["stateDerivative", "suppliedTolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    absoluteResidual: { type: "number" },
    withinTolerance: { type: "boolean" },
  },
  required: ["absoluteResidual", "withinTolerance"],
} as const;
/** Compare one explicitly supplied equilibrium state-derivative residual with an inclusive caller-selected absolute tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stateDerivative, suppliedTolerance } = request;
  const compute = (): Output => {
    H.domain(suppliedTolerance >= 0, "suppliedTolerance");
    return {
      absoluteResidual: Math.abs(stateDerivative),
      withinTolerance: Math.abs(stateDerivative) <= suppliedTolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stateDerivative: 0.02, suppliedTolerance: 0.05 },
  output: { absoluteResidual: 0.02, withinTolerance: true },
} satisfies ToolExample<Input, Output>;
export const equilibriumStateResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["cybernetics", "engineering"],
      keywords: ["cybernetics", "engineering"],
    },
    id: "cybernetics/equilibrium-state-residual",
    title: "Equilibrium State Residual",
    description:
      "Compare one explicitly supplied equilibrium state-derivative residual with an inclusive caller-selected absolute tolerance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stateDerivative: { type: "number" },
        suppliedTolerance: { type: "number", minimum: 0 },
      },
      required: ["stateDerivative", "suppliedTolerance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        absoluteResidual: { type: "number" },
        withinTolerance: { type: "boolean" },
      },
      required: ["absoluteResidual", "withinTolerance"],
    },
    ports: {
      inputs: [
        {
          id: "stateDerivative",
          label: "State Derivative",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTolerance",
          label: "Supplied Tolerance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "absoluteResidual",
          label: "Absolute Residual",
          valueType: { type: "number" },
        },
        {
          id: "withinTolerance",
          label: "Within Tolerance",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = equilibriumStateResidualTool.execute;
export default equilibriumStateResidualTool;
