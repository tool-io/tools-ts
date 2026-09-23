import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cycleSeconds: number;
  readonly systolicSeconds: number;
  readonly unclassifiedSeconds: number;
};
export type Output = {
  readonly diastolicSeconds: number;
  readonly systolicFraction: number;
  readonly diastolicFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleSeconds: { type: "number", exclusiveMinimum: 0 },
    systolicSeconds: { type: "number", minimum: 0 },
    unclassifiedSeconds: { type: "number", minimum: 0 },
  },
  required: ["cycleSeconds", "systolicSeconds", "unclassifiedSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diastolicSeconds: { type: "number" },
    systolicFraction: { type: "number" },
    diastolicFraction: { type: "number" },
  },
  required: ["diastolicSeconds", "systolicFraction", "diastolicFraction"],
} as const;
/** Calculate cardiac cycle systolic diastolic share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cycleSeconds, systolicSeconds, unclassifiedSeconds } = request;
  const compute = (): Output => {
    H.positive(cycleSeconds);
    H.domain(
      systolicSeconds >= 0 &&
        unclassifiedSeconds >= 0 &&
        systolicSeconds + unclassifiedSeconds <= cycleSeconds,
    );
    return {
      diastolicSeconds: cycleSeconds - systolicSeconds - unclassifiedSeconds,
      systolicFraction: systolicSeconds / cycleSeconds,
      diastolicFraction:
        (cycleSeconds - systolicSeconds - unclassifiedSeconds) / cycleSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cycleSeconds: 1, systolicSeconds: 0.3, unclassifiedSeconds: 0.1 },
  output: {
    diastolicSeconds: 0.6,
    systolicFraction: 0.3,
    diastolicFraction: 0.6,
  },
} satisfies ToolExample<Input, Output>;
export const cardiacCycleSystolicDiastolicShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cardiology/cardiac-cycle-systolic-diastolic-share",
    title: "Cardiac Cycle Systolic Diastolic Share Tool",
    description:
      "Calculate cardiac cycle systolic diastolic share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleSeconds: { type: "number", exclusiveMinimum: 0 },
        systolicSeconds: { type: "number", minimum: 0 },
        unclassifiedSeconds: { type: "number", minimum: 0 },
      },
      required: ["cycleSeconds", "systolicSeconds", "unclassifiedSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        diastolicSeconds: { type: "number" },
        systolicFraction: { type: "number" },
        diastolicFraction: { type: "number" },
      },
      required: ["diastolicSeconds", "systolicFraction", "diastolicFraction"],
    },
    ports: {
      inputs: [
        {
          id: "cycleSeconds",
          label: "Cycle Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "systolicSeconds",
          label: "Systolic Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "unclassifiedSeconds",
          label: "Unclassified Seconds",
          required: true,
          valueType: { type: "number", unit: "s" },
        },
      ],
      outputs: [
        {
          id: "diastolicSeconds",
          label: "Diastolic Seconds",
          valueType: { type: "number", unit: "s" },
        },
        {
          id: "systolicFraction",
          label: "Systolic Fraction",
          valueType: { type: "number" },
        },
        {
          id: "diastolicFraction",
          label: "Diastolic Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cardiacCycleSystolicDiastolicShareTool.execute;
export default cardiacCycleSystolicDiastolicShareTool;
