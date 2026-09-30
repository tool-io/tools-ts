import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counterStart: number;
  readonly counterEnd: number;
  readonly elapsedSourceTime: number;
  readonly suppliedTargetTimesPerSourceTime: number;
};
export type Output = { readonly ratePerTargetTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counterStart: { type: "number" },
    counterEnd: { type: "number" },
    elapsedSourceTime: { type: "number", exclusiveMinimum: 0 },
    suppliedTargetTimesPerSourceTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "counterStart",
    "counterEnd",
    "elapsedSourceTime",
    "suppliedTargetTimesPerSourceTime",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { ratePerTargetTime: { type: "number" } },
  required: ["ratePerTargetTime"],
} as const;
/** Rescale a non-reset monotone counter increment to caller-supplied target time units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    counterStart,
    counterEnd,
    elapsedSourceTime,
    suppliedTargetTimesPerSourceTime,
  } = request;
  const compute = (): Output => {
    H.positive(elapsedSourceTime);
    H.positive(suppliedTargetTimesPerSourceTime);
    H.domain(counterEnd >= counterStart);
    return {
      ratePerTargetTime:
        (counterEnd - counterStart) /
        (elapsedSourceTime * suppliedTargetTimesPerSourceTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    counterStart: 100,
    counterEnd: 160,
    elapsedSourceTime: 2,
    suppliedTargetTimesPerSourceTime: 60,
  },
  output: { ratePerTargetTime: 0.5 },
} satisfies ToolExample<Input, Output>;
export const monotoneCounterRateUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "metrics/monotone-counter-rate-unit-factor",
    title: "Monotone Counter Rate Unit Factor Tool",
    description:
      "Rescale a non-reset monotone counter increment to caller-supplied target time units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counterStart: { type: "number" },
        counterEnd: { type: "number" },
        elapsedSourceTime: { type: "number", exclusiveMinimum: 0 },
        suppliedTargetTimesPerSourceTime: {
          type: "number",
          exclusiveMinimum: 0,
        },
      },
      required: [
        "counterStart",
        "counterEnd",
        "elapsedSourceTime",
        "suppliedTargetTimesPerSourceTime",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { ratePerTargetTime: { type: "number" } },
      required: ["ratePerTargetTime"],
    },
    ports: {
      inputs: [
        {
          id: "counterStart",
          label: "Counter Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "counterEnd",
          label: "Counter End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedSourceTime",
          label: "Elapsed Source Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedTargetTimesPerSourceTime",
          label: "Supplied Target Times Per Source Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "ratePerTargetTime",
          label: "Rate Per Target Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = monotoneCounterRateUnitFactorTool.execute;
export default monotoneCounterRateUnitFactorTool;
