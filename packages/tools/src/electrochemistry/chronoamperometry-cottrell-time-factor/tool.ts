import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceCurrent: number;
  readonly referenceTime: number;
  readonly time: number;
};
export type Output = { readonly current: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceCurrent: { type: "number" },
    referenceTime: { type: "number", exclusiveMinimum: 0 },
    time: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["referenceCurrent", "referenceTime", "time"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { current: { type: "number" } },
  required: ["current"],
} as const;
/** Cottrell inverse-square-root time scaling for planar semi-infinite diffusion after a potential step. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceCurrent, referenceTime, time } = request;
  const compute = (): Output => {
    H.positive(referenceTime);
    H.positive(time);
    return { current: referenceCurrent * Math.sqrt(referenceTime / time) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceCurrent: 10, referenceTime: 1, time: 4 },
  output: { current: 5 },
} satisfies ToolExample<Input, Output>;
export const chronoamperometryCottrellTimeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/chronoamperometry-cottrell-time-factor",
      title: "Chronoamperometry Cottrell Time Factor Tool",
      description:
        "Cottrell inverse-square-root time scaling for planar semi-infinite diffusion after a potential step.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceCurrent: { type: "number" },
          referenceTime: { type: "number", exclusiveMinimum: 0 },
          time: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["referenceCurrent", "referenceTime", "time"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { current: { type: "number" } },
        required: ["current"],
      },
      ports: {
        inputs: [
          {
            id: "referenceCurrent",
            label: "Reference Current",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceTime",
            label: "Reference Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "time",
            label: "Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "current", label: "Current", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = chronoamperometryCottrellTimeFactorTool.execute;
export default chronoamperometryCottrellTimeFactorTool;
