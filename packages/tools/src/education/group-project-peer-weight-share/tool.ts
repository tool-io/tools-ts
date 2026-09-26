import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly groupMark: number;
  readonly weights: readonly number[];
  readonly member: number;
};
export type Output = {
  readonly memberMark: number;
  readonly multiplier: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    groupMark: { type: "number" },
    weights: { type: "array", maxItems: 256, items: { type: "number" } },
    member: { type: "integer", minimum: 0 },
  },
  required: ["groupMark", "weights", "member"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    memberMark: { type: "number" },
    multiplier: { type: "number" },
  },
  required: ["memberMark", "multiplier"],
} as const;
/** Normalize explicit peer weights to mean one; this arithmetic may exceed a nominal grade cap unless a separate cap is applied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { groupMark, weights, member } = request;
  const compute = (): Output => {
    H.integer(member, 0, weights.length - 1);
    H.domain(weights.every((x) => x >= 0));
    H.positive(weights.reduce((a, b) => a + b, 0));
    return {
      memberMark:
        (groupMark * weights[member] * weights.length) /
        weights.reduce((a, b) => a + b, 0),
      multiplier:
        (weights[member] * weights.length) / weights.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { groupMark: 80, weights: [1, 2, 1], member: 1 },
  output: { memberMark: 120, multiplier: 1.5 },
} satisfies ToolExample<Input, Output>;
export const groupProjectPeerWeightShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/group-project-peer-weight-share",
    title: "Group Project Peer Weight Share Tool",
    description:
      "Normalize explicit peer weights to mean one; this arithmetic may exceed a nominal grade cap unless a separate cap is applied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        groupMark: { type: "number" },
        weights: { type: "array", maxItems: 256, items: { type: "number" } },
        member: { type: "integer", minimum: 0 },
      },
      required: ["groupMark", "weights", "member"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        memberMark: { type: "number" },
        multiplier: { type: "number" },
      },
      required: ["memberMark", "multiplier"],
    },
    ports: {
      inputs: [
        {
          id: "groupMark",
          label: "Group Mark",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "member",
          label: "Member",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "memberMark",
          label: "Member Mark",
          valueType: { type: "number" },
        },
        {
          id: "multiplier",
          label: "Multiplier",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = groupProjectPeerWeightShareTool.execute;
export default groupProjectPeerWeightShareTool;
