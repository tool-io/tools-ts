import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly commitment: number;
  readonly funded: number;
  readonly newCall: number;
};
export type Output = {
  readonly unfunded: number;
  readonly afterCall: number;
  readonly exceeds: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commitment: { type: "number", minimum: 0 },
    funded: { type: "number", minimum: 0 },
    newCall: { type: "number", minimum: 0 },
  },
  required: ["commitment", "funded", "newCall"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    unfunded: { type: "number" },
    afterCall: { type: "number" },
    exceeds: { type: "boolean" },
  },
  required: ["unfunded", "afterCall", "exceeds"],
} as const;
/** Calculate capital call unfunded commitment balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { commitment, funded, newCall } = request;
  const compute = (): Output => {
    H.domain(
      commitment >= 0 && funded >= 0 && funded <= commitment && newCall >= 0,
    );
    const unfunded = commitment - funded;
    return {
      unfunded,
      afterCall: unfunded - newCall,
      exceeds: newCall > unfunded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { commitment: 100000, funded: 40000, newCall: 20000 },
  output: { unfunded: 60000, afterCall: 40000, exceeds: false },
} satisfies ToolExample<Input, Output>;
export const capitalCallUnfundedCommitmentBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "finance/capital-call-unfunded-commitment-balance",
      title: "Capital Call Unfunded Commitment Balance Tool",
      description:
        "Calculate capital call unfunded commitment balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          commitment: { type: "number", minimum: 0 },
          funded: { type: "number", minimum: 0 },
          newCall: { type: "number", minimum: 0 },
        },
        required: ["commitment", "funded", "newCall"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          unfunded: { type: "number" },
          afterCall: { type: "number" },
          exceeds: { type: "boolean" },
        },
        required: ["unfunded", "afterCall", "exceeds"],
      },
      ports: {
        inputs: [
          {
            id: "commitment",
            label: "Commitment",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "funded",
            label: "Funded",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newCall",
            label: "New Call",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "unfunded", label: "Unfunded", valueType: { type: "number" } },
          {
            id: "afterCall",
            label: "After Call",
            valueType: { type: "number" },
          },
          { id: "exceeds", label: "Exceeds", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = capitalCallUnfundedCommitmentBalanceTool.execute;
export default capitalCallUnfundedCommitmentBalanceTool;
