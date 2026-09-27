import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly beforeMass: number; readonly afterMass: number };
export type Output = {
  readonly loss: number;
  readonly lossFraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    beforeMass: { type: "number", minimum: 0 },
    afterMass: { type: "number", minimum: 0 },
  },
  required: ["beforeMass", "afterMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    loss: { type: "number" },
    lossFraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["loss", "lossFraction", "defined"],
} as const;
/** Compare supplied drying sample masses, preserving gains as negative loss. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { beforeMass, afterMass } = request;
  const compute = (): Output => {
    H.domain(beforeMass >= 0 && afterMass >= 0);
    return {
      loss: beforeMass - afterMass,
      lossFraction: beforeMass > 0 ? (beforeMass - afterMass) / beforeMass : 0,
      defined: beforeMass > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { beforeMass: 100, afterMass: 80 },
  output: { loss: 20, lossFraction: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const dryingSampleMassLossStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/drying-sample-mass-loss-step",
    title: "Drying Sample Mass Loss Step Tool",
    description:
      "Compare supplied drying sample masses, preserving gains as negative loss.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        beforeMass: { type: "number", minimum: 0 },
        afterMass: { type: "number", minimum: 0 },
      },
      required: ["beforeMass", "afterMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        loss: { type: "number" },
        lossFraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["loss", "lossFraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "beforeMass",
          label: "Before Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "afterMass",
          label: "After Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "loss", label: "Loss", valueType: { type: "number" } },
        {
          id: "lossFraction",
          label: "Loss Fraction",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = dryingSampleMassLossStepTool.execute;
export default dryingSampleMassLossStepTool;
