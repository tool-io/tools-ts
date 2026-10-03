import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly less: number;
  readonly tied: number;
  readonly count: number;
};
export type Output = {
  readonly leftLimit: number;
  readonly rightLimit: number;
  readonly jump: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    less: { type: "integer", minimum: 0 },
    tied: { type: "integer", minimum: 0 },
    count: { type: "integer", minimum: 1 },
  },
  required: ["less", "tied", "count"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftLimit: { type: "number" },
    rightLimit: { type: "number" },
    jump: { type: "number" },
  },
  required: ["leftLimit", "rightLimit", "jump"],
} as const;
/** Calculate empirical cdf one tie jump from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { less, tied, count } = request;
  const compute = (): Output => {
    H.integer(count, 1);
    H.integer(less, 0, count);
    H.integer(tied, 0, count - less);
    return {
      leftLimit: less / count,
      rightLimit: (less + tied) / count,
      jump: tied / count,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { less: 3, tied: 2, count: 10 },
  output: { leftLimit: 0.3, rightLimit: 0.5, jump: 0.2 },
} satisfies ToolExample<Input, Output>;
export const empiricalCdfOneTieJumpTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/empirical-cdf-one-tie-jump",
    title: "Empirical Cdf One Tie Jump Tool",
    description:
      "Calculate empirical cdf one tie jump from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        less: { type: "integer", minimum: 0 },
        tied: { type: "integer", minimum: 0 },
        count: { type: "integer", minimum: 1 },
      },
      required: ["less", "tied", "count"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftLimit: { type: "number" },
        rightLimit: { type: "number" },
        jump: { type: "number" },
      },
      required: ["leftLimit", "rightLimit", "jump"],
    },
    ports: {
      inputs: [
        {
          id: "less",
          label: "Less",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tied",
          label: "Tied",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "leftLimit", label: "Left Limit", valueType: { type: "number" } },
        {
          id: "rightLimit",
          label: "Right Limit",
          valueType: { type: "number" },
        },
        { id: "jump", label: "Jump", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = empiricalCdfOneTieJumpTool.execute;
export default empiricalCdfOneTieJumpTool;
