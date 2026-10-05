import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lowerMiddle: number;
  readonly upperMiddle: number;
  readonly policy: string;
};
export type Output = { readonly median: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerMiddle: { type: "number" },
    upperMiddle: { type: "number" },
    policy: {
      type: "string",
      maxLength: 8192,
      enum: ["lower", "upper", "average"],
    },
  },
  required: ["lowerMiddle", "upperMiddle", "policy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { median: { type: "number" } },
  required: ["median"],
} as const;
/** Resolve an even-sample median from its ordered middle pair under an explicit lower, upper, or average convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lowerMiddle, upperMiddle, policy } = request;
  const compute = (): Output => {
    H.domain(lowerMiddle <= upperMiddle, "lowerMiddle");
    H.domain(["lower", "upper", "average"].includes(policy), "policy");
    return {
      median:
        policy === "lower"
          ? lowerMiddle
          : policy === "upper"
            ? upperMiddle
            : lowerMiddle / 2 + upperMiddle / 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lowerMiddle: 4, upperMiddle: 8, policy: "average" },
  output: { median: 6 },
} satisfies ToolExample<Input, Output>;
export const medianEvenMiddlePairPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/median-even-middle-pair-policy",
    title: "Median Even Middle Pair Policy Tool",
    description:
      "Resolve an even-sample median from its ordered middle pair under an explicit lower, upper, or average convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerMiddle: { type: "number" },
        upperMiddle: { type: "number" },
        policy: {
          type: "string",
          maxLength: 8192,
          enum: ["lower", "upper", "average"],
        },
      },
      required: ["lowerMiddle", "upperMiddle", "policy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { median: { type: "number" } },
      required: ["median"],
    },
    ports: {
      inputs: [
        {
          id: "lowerMiddle",
          label: "Lower Middle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "upperMiddle",
          label: "Upper Middle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "policy",
          label: "Policy",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "median", label: "Median", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = medianEvenMiddlePairPolicyTool.execute;
export default medianEvenMiddlePairPolicyTool;
