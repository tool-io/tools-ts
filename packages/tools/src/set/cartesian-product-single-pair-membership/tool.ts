import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly leftElement: string;
  readonly rightElement: string;
  readonly left: readonly string[];
  readonly right: readonly string[];
};
export type Output = {
  readonly member: boolean;
  readonly missingFactors: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftElement: { type: "string", maxLength: 8192 },
    rightElement: { type: "string", maxLength: 8192 },
    left: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    right: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["leftElement", "rightElement", "left", "right"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    member: { type: "boolean" },
    missingFactors: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["member", "missingFactors"],
} as const;
/** Compute cartesian product single pair membership from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { leftElement, rightElement, left, right } = input;
  const compute = (): Output => {
    const l = left.includes(leftElement),
      r = right.includes(rightElement);
    return {
      member: l && r,
      missingFactors: [...(!l ? ["left"] : []), ...(!r ? ["right"] : [])],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { leftElement: "a", rightElement: "b", left: ["a"], right: ["c"] },
  output: { member: false, missingFactors: ["right"] },
} satisfies ToolExample<Input, Output>;
export const cartesianProductSinglePairMembershipTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "set/cartesian-product-single-pair-membership",
  title: "Cartesian Product Single Pair Membership Tool",
  description:
    "Compute cartesian product single pair membership from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "leftElement",
        label: "Left Element",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "rightElement",
        label: "Right Element",
        required: true,
        valueType: { type: "string" },
      },
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
    outputs: [
      { id: "member", label: "Member", valueType: { type: "boolean" } },
      {
        id: "missingFactors",
        label: "Missing Factors",
        valueType: { type: "list", items: { type: "string" } },
      },
    ],
  },
});
export const run = cartesianProductSinglePairMembershipTool.execute;
export default cartesianProductSinglePairMembershipTool;
