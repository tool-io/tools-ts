import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cycleStartSeconds: number;
  readonly cycleEndSeconds: number;
};
export type Output = {
  readonly periodSeconds: number;
  readonly cyclesPerMinute: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cycleStartSeconds: { type: "number" },
    cycleEndSeconds: { type: "number" },
  },
  required: ["cycleStartSeconds", "cycleEndSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    periodSeconds: { type: "number" },
    cyclesPerMinute: { type: "number" },
  },
  required: ["periodSeconds", "cyclesPerMinute"],
} as const;
/** Convert one explicitly marked positive respiratory-cycle period into cycles per minute without estimating clinical respiratory rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cycleStartSeconds, cycleEndSeconds } = request;
  const compute = (): Output => {
    H.domain(cycleEndSeconds > cycleStartSeconds, "cycleEndSeconds");
    return {
      periodSeconds: cycleEndSeconds - cycleStartSeconds,
      cyclesPerMinute: 60 / (cycleEndSeconds - cycleStartSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cycleStartSeconds: 10, cycleEndSeconds: 14 },
  output: { periodSeconds: 4, cyclesPerMinute: 15 },
} satisfies ToolExample<Input, Output>;
export const respirationCyclePeriodPairTool = H.defineSchemaCalculation<
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
    id: "physiology/respiration-cycle-period-pair",
    title: "Respiration Cycle Period Pair",
    description:
      "Convert one explicitly marked positive respiratory-cycle period into cycles per minute without estimating clinical respiratory rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cycleStartSeconds: { type: "number" },
        cycleEndSeconds: { type: "number" },
      },
      required: ["cycleStartSeconds", "cycleEndSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        periodSeconds: { type: "number" },
        cyclesPerMinute: { type: "number" },
      },
      required: ["periodSeconds", "cyclesPerMinute"],
    },
    ports: {
      inputs: [
        {
          id: "cycleStartSeconds",
          label: "Cycle Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cycleEndSeconds",
          label: "Cycle End Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "periodSeconds",
          label: "Period Seconds",
          valueType: { type: "number" },
        },
        {
          id: "cyclesPerMinute",
          label: "Cycles Per Minute",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = respirationCyclePeriodPairTool.execute;
export default respirationCyclePeriodPairTool;
