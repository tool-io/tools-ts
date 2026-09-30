import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exitPeriod: number;
  readonly reentryPeriod: number;
  readonly periodsPerCycle: number;
};
export type Output = {
  readonly gapDecimal: string;
  readonly sameCycle: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exitPeriod: { type: "integer", minimum: 0 },
    reentryPeriod: { type: "integer", minimum: 0 },
    periodsPerCycle: { type: "integer", minimum: 1 },
  },
  required: ["exitPeriod", "reentryPeriod", "periodsPerCycle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapDecimal: { type: "string", maxLength: 8192, format: "integer-decimal" },
    sameCycle: { type: "boolean" },
  },
  required: ["gapDecimal", "sameCycle"],
} as const;
/** Calculate lead reentry period gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exitPeriod, reentryPeriod, periodsPerCycle } = request;
  const compute = (): Output => {
    H.integer(exitPeriod, 0);
    H.integer(reentryPeriod, 0);
    H.integer(periodsPerCycle, 1);
    return {
      gapDecimal: (BigInt(reentryPeriod) - BigInt(exitPeriod)).toString(),
      sameCycle:
        BigInt(exitPeriod) / BigInt(periodsPerCycle) ===
        BigInt(reentryPeriod) / BigInt(periodsPerCycle),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exitPeriod: 5, reentryPeriod: 8, periodsPerCycle: 12 },
  output: { gapDecimal: "3", sameCycle: true },
} satisfies ToolExample<Input, Output>;
export const leadReentryPeriodGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/lead-reentry-period-gap",
    title: "Lead Reentry Period Gap Tool",
    description:
      "Calculate lead reentry period gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exitPeriod: { type: "integer", minimum: 0 },
        reentryPeriod: { type: "integer", minimum: 0 },
        periodsPerCycle: { type: "integer", minimum: 1 },
      },
      required: ["exitPeriod", "reentryPeriod", "periodsPerCycle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        sameCycle: { type: "boolean" },
      },
      required: ["gapDecimal", "sameCycle"],
    },
    ports: {
      inputs: [
        {
          id: "exitPeriod",
          label: "Exit Period",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reentryPeriod",
          label: "Reentry Period",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "periodsPerCycle",
          label: "Periods Per Cycle",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "gapDecimal",
          label: "Gap Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "sameCycle",
          label: "Same Cycle",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = leadReentryPeriodGapTool.execute;
export default leadReentryPeriodGapTool;
