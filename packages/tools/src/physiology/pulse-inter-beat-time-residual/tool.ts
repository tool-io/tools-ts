import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedIntervalMilliseconds: number;
  readonly referenceIntervalMilliseconds: number;
};
export type Output = { readonly residualMilliseconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedIntervalMilliseconds: { type: "number", exclusiveMinimum: 0 },
    referenceIntervalMilliseconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["observedIntervalMilliseconds", "referenceIntervalMilliseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { residualMilliseconds: { type: "number" } },
  required: ["residualMilliseconds"],
} as const;
/** Compare explicitly supplied pulse intervals without identifying arrhythmias or constructing an interbeat series. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedIntervalMilliseconds, referenceIntervalMilliseconds } =
    request;
  const compute = (): Output => {
    (H.domain(observedIntervalMilliseconds > 0, "observedIntervalMilliseconds"),
      observedIntervalMilliseconds);
    (H.domain(
      referenceIntervalMilliseconds > 0,
      "referenceIntervalMilliseconds",
    ),
      referenceIntervalMilliseconds);
    return {
      residualMilliseconds:
        observedIntervalMilliseconds - referenceIntervalMilliseconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedIntervalMilliseconds: 820,
    referenceIntervalMilliseconds: 800,
  },
  output: { residualMilliseconds: 20 },
} satisfies ToolExample<Input, Output>;
export const pulseInterBeatTimeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["physiology", "biology"],
      keywords: ["physiology", "biology"],
    },
    id: "physiology/pulse-inter-beat-time-residual",
    title: "Pulse Inter Beat Time Residual",
    description:
      "Compare explicitly supplied pulse intervals without identifying arrhythmias or constructing an interbeat series.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedIntervalMilliseconds: { type: "number", exclusiveMinimum: 0 },
        referenceIntervalMilliseconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "observedIntervalMilliseconds",
        "referenceIntervalMilliseconds",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { residualMilliseconds: { type: "number" } },
      required: ["residualMilliseconds"],
    },
    ports: {
      inputs: [
        {
          id: "observedIntervalMilliseconds",
          label: "Observed Interval Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceIntervalMilliseconds",
          label: "Reference Interval Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "residualMilliseconds",
          label: "Residual Milliseconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = pulseInterBeatTimeResidualTool.execute;
export default pulseInterBeatTimeResidualTool;
