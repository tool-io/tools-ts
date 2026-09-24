import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initial: number;
  readonly stoichiometricCoefficient: number;
  readonly reactionExtent: number;
  readonly suppliedFinal: number;
};
export type Output = {
  readonly expectedFinal: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initial: { type: "number", minimum: 0 },
    stoichiometricCoefficient: { type: "number" },
    reactionExtent: { type: "number", minimum: 0 },
    suppliedFinal: { type: "number", minimum: 0 },
  },
  required: [
    "initial",
    "stoichiometricCoefficient",
    "reactionExtent",
    "suppliedFinal",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedFinal: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedFinal", "residual"],
} as const;
/** Calculate reaction species count residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initial, stoichiometricCoefficient, reactionExtent, suppliedFinal } =
    request;
  const compute = (): Output => {
    H.domain(
      initial >= 0 &&
        reactionExtent >= 0 &&
        suppliedFinal >= 0 &&
        initial + stoichiometricCoefficient * reactionExtent >= 0,
    );
    return {
      expectedFinal: initial + stoichiometricCoefficient * reactionExtent,
      residual:
        suppliedFinal - initial - stoichiometricCoefficient * reactionExtent,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initial: 10,
    stoichiometricCoefficient: -2,
    reactionExtent: 3,
    suppliedFinal: 5,
  },
  output: { expectedFinal: 4, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const reactionSpeciesCountResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/reaction-species-count-residual",
    title: "Reaction Species Count Residual Tool",
    description:
      "Calculate reaction species count residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initial: { type: "number", minimum: 0 },
        stoichiometricCoefficient: { type: "number" },
        reactionExtent: { type: "number", minimum: 0 },
        suppliedFinal: { type: "number", minimum: 0 },
      },
      required: [
        "initial",
        "stoichiometricCoefficient",
        "reactionExtent",
        "suppliedFinal",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedFinal: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedFinal", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "initial",
          label: "Initial",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "stoichiometricCoefficient",
          label: "Stoichiometric Coefficient",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reactionExtent",
          label: "Reaction Extent",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFinal",
          label: "Supplied Final",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedFinal",
          label: "Expected Final",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = reactionSpeciesCountResidualTool.execute;
export default reactionSpeciesCountResidualTool;
