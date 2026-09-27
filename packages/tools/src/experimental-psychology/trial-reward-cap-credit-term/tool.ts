import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earned: number;
  readonly priorReward: number;
  readonly cap: number;
  readonly withheld: number;
};
export type Output = { readonly credited: number; readonly uncredited: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earned: { type: "number", minimum: 0 },
    priorReward: { type: "number", minimum: 0 },
    cap: { type: "number", minimum: 0 },
    withheld: { type: "number", minimum: 0 },
  },
  required: ["earned", "priorReward", "cap", "withheld"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { credited: { type: "number" }, uncredited: { type: "number" } },
  required: ["credited", "uncredited"],
} as const;
/** Calculate trial reward cap credit term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earned, priorReward, cap, withheld } = request;
  const compute = (): Output => {
    H.domain(
      earned >= 0 &&
        priorReward >= 0 &&
        cap >= 0 &&
        withheld >= 0 &&
        withheld <= earned,
    );
    return {
      credited: Math.max(0, Math.min(earned - withheld, cap - priorReward)),
      uncredited:
        earned - Math.max(0, Math.min(earned - withheld, cap - priorReward)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { earned: 20, priorReward: 90, cap: 100, withheld: 2 },
  output: { credited: 10, uncredited: 10 },
} satisfies ToolExample<Input, Output>;
export const trialRewardCapCreditTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "experimental-psychology/trial-reward-cap-credit-term",
    title: "Trial Reward Cap Credit Term Tool",
    description:
      "Calculate trial reward cap credit term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earned: { type: "number", minimum: 0 },
        priorReward: { type: "number", minimum: 0 },
        cap: { type: "number", minimum: 0 },
        withheld: { type: "number", minimum: 0 },
      },
      required: ["earned", "priorReward", "cap", "withheld"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        credited: { type: "number" },
        uncredited: { type: "number" },
      },
      required: ["credited", "uncredited"],
    },
    ports: {
      inputs: [
        {
          id: "earned",
          label: "Earned",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "priorReward",
          label: "Prior Reward",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cap",
          label: "Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withheld",
          label: "Withheld",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "credited", label: "Credited", valueType: { type: "number" } },
        {
          id: "uncredited",
          label: "Uncredited",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trialRewardCapCreditTermTool.execute;
export default trialRewardCapCreditTermTool;
