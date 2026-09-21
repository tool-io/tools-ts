import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventTime: number;
  readonly resetTime: number;
  readonly equalityInNewPeriod: boolean;
};
export type Output = { readonly newPeriod: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventTime: { type: "number" },
    resetTime: { type: "number" },
    equalityInNewPeriod: { type: "boolean" },
  },
  required: ["eventTime", "resetTime", "equalityInNewPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newPeriod: { type: "boolean" } },
  required: ["newPeriod"],
} as const;
/** Calculate ad frequency reset boundary token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventTime, resetTime, equalityInNewPeriod } = request;
  const compute = (): Output => {
    return {
      newPeriod: equalityInNewPeriod
        ? eventTime >= resetTime
        : eventTime > resetTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { eventTime: 100, resetTime: 100, equalityInNewPeriod: true },
  output: { newPeriod: true },
} satisfies ToolExample<Input, Output>;
export const adFrequencyResetBoundaryTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "advertising/ad-frequency-reset-boundary-token",
    title: "Ad Frequency Reset Boundary Token Tool",
    description:
      "Calculate ad frequency reset boundary token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventTime: { type: "number" },
        resetTime: { type: "number" },
        equalityInNewPeriod: { type: "boolean" },
      },
      required: ["eventTime", "resetTime", "equalityInNewPeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { newPeriod: { type: "boolean" } },
      required: ["newPeriod"],
    },
    ports: {
      inputs: [
        {
          id: "eventTime",
          label: "Event Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "resetTime",
          label: "Reset Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityInNewPeriod",
          label: "Equality In New Period",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "newPeriod",
          label: "New Period",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = adFrequencyResetBoundaryTokenTool.execute;
export default adFrequencyResetBoundaryTokenTool;
