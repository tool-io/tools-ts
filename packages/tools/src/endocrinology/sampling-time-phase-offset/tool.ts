import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sampleTime: number;
  readonly phaseOrigin: number;
  readonly suppliedPeriod: number;
};
export type Output = { readonly phase: number; readonly cycle: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleTime: { type: "number" },
    phaseOrigin: { type: "number" },
    suppliedPeriod: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleTime", "phaseOrigin", "suppliedPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { phase: { type: "number" }, cycle: { type: "number" } },
  required: ["phase", "cycle"],
} as const;
/** Map supplied sampling time to a caller-defined periodic research phase without inferring a biological rhythm. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleTime, phaseOrigin, suppliedPeriod } = request;
  const compute = (): Output => {
    H.positive(suppliedPeriod);
    const delta = sampleTime - phaseOrigin,
      r = delta % suppliedPeriod;
    return {
      phase: r < 0 ? r + suppliedPeriod : r,
      cycle: Math.floor(delta / suppliedPeriod),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleTime: 27, phaseOrigin: 10, suppliedPeriod: 12 },
  output: { phase: 5, cycle: 1 },
} satisfies ToolExample<Input, Output>;
export const samplingTimePhaseOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/sampling-time-phase-offset",
    title: "Sampling Time Phase Offset Tool",
    description:
      "Map supplied sampling time to a caller-defined periodic research phase without inferring a biological rhythm.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleTime: { type: "number" },
        phaseOrigin: { type: "number" },
        suppliedPeriod: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampleTime", "phaseOrigin", "suppliedPeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { phase: { type: "number" }, cycle: { type: "number" } },
      required: ["phase", "cycle"],
    },
    ports: {
      inputs: [
        {
          id: "sampleTime",
          label: "Sample Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "phaseOrigin",
          label: "Phase Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPeriod",
          label: "Supplied Period",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "phase", label: "Phase", valueType: { type: "number" } },
        { id: "cycle", label: "Cycle", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = samplingTimePhaseOffsetTool.execute;
export default samplingTimePhaseOffsetTool;
