import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elapsed: number;
  readonly cliff: number;
  readonly totalDuration: number;
  readonly totalShares: number;
};
export type Output = {
  readonly vestedShare: number;
  readonly vestedShares: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elapsed: { type: "number", minimum: 0 },
    cliff: { type: "number", minimum: 0 },
    totalDuration: { type: "number", exclusiveMinimum: 0 },
    totalShares: { type: "number", minimum: 0 },
  },
  required: ["elapsed", "cliff", "totalDuration", "totalShares"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vestedShare: { type: "number" },
    vestedShares: { type: "number" },
  },
  required: ["vestedShare", "vestedShares"],
} as const;
/** Evaluate an explicitly supplied continuous linear vesting schedule with a cliff; no legal terms or monthly rounding are inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elapsed, cliff, totalDuration, totalShares } = request;
  const compute = (): Output => {
    H.positive(totalDuration);
    H.domain(
      elapsed >= 0 && cliff >= 0 && cliff <= totalDuration && totalShares >= 0,
    );
    return {
      vestedShare: elapsed < cliff ? 0 : Math.min(elapsed / totalDuration, 1),
      vestedShares:
        totalShares *
        (elapsed < cliff ? 0 : Math.min(elapsed / totalDuration, 1)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { elapsed: 12, cliff: 12, totalDuration: 48, totalShares: 400 },
  output: { vestedShare: 0.25, vestedShares: 100 },
} satisfies ToolExample<Input, Output>;
export const founderVestingCliffShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/founder-vesting-cliff-share",
    title: "Founder Vesting Cliff Share Tool",
    description:
      "Evaluate an explicitly supplied continuous linear vesting schedule with a cliff; no legal terms or monthly rounding are inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elapsed: { type: "number", minimum: 0 },
        cliff: { type: "number", minimum: 0 },
        totalDuration: { type: "number", exclusiveMinimum: 0 },
        totalShares: { type: "number", minimum: 0 },
      },
      required: ["elapsed", "cliff", "totalDuration", "totalShares"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vestedShare: { type: "number" },
        vestedShares: { type: "number" },
      },
      required: ["vestedShare", "vestedShares"],
    },
    ports: {
      inputs: [
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cliff",
          label: "Cliff",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalDuration",
          label: "Total Duration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalShares",
          label: "Total Shares",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "vestedShare",
          label: "Vested Share",
          valueType: { type: "number" },
        },
        {
          id: "vestedShares",
          label: "Vested Shares",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = founderVestingCliffShareTool.execute;
export default founderVestingCliffShareTool;
