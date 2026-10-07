import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly rawAmount: number; readonly quantum: number };
export type Output = {
  readonly roundedAmount: number;
  readonly roundingResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawAmount: { type: "number", minimum: 0 },
    quantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["rawAmount", "quantum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roundedAmount: { type: "number" },
    roundingResidual: { type: "number" },
  },
  required: ["roundedAmount", "roundingResidual"],
} as const;
/** Round a supplied nonnegative incentive to the nearest explicit quantum, with ties upward, and report the signed rounding adjustment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawAmount, quantum } = request;
  const compute = (): Output => {
    H.domain(rawAmount >= 0, "rawAmount");
    (H.domain(Number.isFinite(quantum) && quantum > 0, "quantum"), quantum);
    return (() => {
      const roundedAmount = Math.round(rawAmount / quantum) * quantum;
      return { roundedAmount, roundingResidual: roundedAmount - rawAmount };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rawAmount: 7.4, quantum: 0.5 },
  output: { roundedAmount: 7.5, roundingResidual: 0.09999999999999964 },
} satisfies ToolExample<Input, Output>;
export const behavioralTaskIncentiveRoundingTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["behavioral-economics", "behavioral economics", "economics"],
      keywords: ["behavioral economics", "economics"],
    },
    id: "behavioral-economics/behavioral-task-incentive-rounding",
    title: "Behavioral Task Incentive Rounding",
    description:
      "Round a supplied nonnegative incentive to the nearest explicit quantum, with ties upward, and report the signed rounding adjustment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawAmount: { type: "number", minimum: 0 },
        quantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["rawAmount", "quantum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roundedAmount: { type: "number" },
        roundingResidual: { type: "number" },
      },
      required: ["roundedAmount", "roundingResidual"],
    },
    ports: {
      inputs: [
        {
          id: "rawAmount",
          label: "Raw Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "roundedAmount",
          label: "Rounded Amount",
          valueType: { type: "number" },
        },
        {
          id: "roundingResidual",
          label: "Rounding Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = behavioralTaskIncentiveRoundingTool.execute;
export default behavioralTaskIncentiveRoundingTool;
