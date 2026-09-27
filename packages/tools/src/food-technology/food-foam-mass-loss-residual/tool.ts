import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialMass: number;
  readonly collectedMass: number;
  readonly knownLoss: number;
};
export type Output = {
  readonly unexplainedLoss: number;
  readonly retainedFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMass: { type: "number", minimum: 0 },
    collectedMass: { type: "number", minimum: 0 },
    knownLoss: { type: "number", minimum: 0 },
  },
  required: ["initialMass", "collectedMass", "knownLoss"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unexplainedLoss: { type: "number" },
    retainedFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["unexplainedLoss", "retainedFraction", "defined"],
} as const;
/** Supplied bench mass ledger preserving signed unexplained residuals. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialMass, collectedMass, knownLoss } = request;
  const compute = (): Output => {
    H.domain(initialMass >= 0 && collectedMass >= 0 && knownLoss >= 0);
    return {
      unexplainedLoss: initialMass - collectedMass - knownLoss,
      retainedFraction: initialMass > 0 ? collectedMass / initialMass : 0,
      defined: initialMass > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initialMass: 100, collectedMass: 80, knownLoss: 15 },
  output: { unexplainedLoss: 5, retainedFraction: 0.8, defined: true },
} satisfies ToolExample<Input, Output>;
export const foodFoamMassLossResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/food-foam-mass-loss-residual",
    title: "Food Foam Mass Loss Residual Tool",
    description:
      "Supplied bench mass ledger preserving signed unexplained residuals.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialMass: { type: "number", minimum: 0 },
        collectedMass: { type: "number", minimum: 0 },
        knownLoss: { type: "number", minimum: 0 },
      },
      required: ["initialMass", "collectedMass", "knownLoss"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        unexplainedLoss: { type: "number" },
        retainedFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["unexplainedLoss", "retainedFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "initialMass",
          label: "Initial Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "collectedMass",
          label: "Collected Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "knownLoss",
          label: "Known Loss",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unexplainedLoss",
          label: "Unexplained Loss",
          valueType: { type: "number" },
        },
        {
          id: "retainedFraction",
          label: "Retained Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = foodFoamMassLossResidualTool.execute;
export default foodFoamMassLossResidualTool;
