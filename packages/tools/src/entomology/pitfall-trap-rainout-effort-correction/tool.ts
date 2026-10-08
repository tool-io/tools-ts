import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledTrapHours: number;
  readonly rainoutTrapHours: number;
  readonly observedCount: number;
};
export type Output = {
  readonly effectiveTrapHours: number;
  readonly countPerTrapHour: number;
  readonly rateDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledTrapHours: { type: "number", minimum: 0 },
    rainoutTrapHours: { type: "number", minimum: 0 },
    observedCount: { type: "integer", minimum: 0 },
  },
  required: ["scheduledTrapHours", "rainoutTrapHours", "observedCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveTrapHours: { type: "number" },
    countPerTrapHour: { type: "number" },
    rateDefined: { type: "boolean" },
  },
  required: ["effectiveTrapHours", "countPerTrapHour", "rateDefined"],
} as const;
/** Remove explicit rainout trap-hours and report observed count rate; at zero effective effort the numeric placeholder is zero with rateDefined=false. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scheduledTrapHours, rainoutTrapHours, observedCount } = request;
  const compute = (): Output => {
    H.domain(scheduledTrapHours >= 0, "scheduledTrapHours");
    H.domain(
      rainoutTrapHours >= 0 && rainoutTrapHours <= scheduledTrapHours,
      "rainoutTrapHours",
    );
    (H.domain(
      Number.isSafeInteger(observedCount) &&
        observedCount >= 0 &&
        observedCount <= Number.MAX_SAFE_INTEGER,
      "observedCount",
    ),
      observedCount);
    return (() => {
      const effectiveTrapHours = scheduledTrapHours - rainoutTrapHours;
      return {
        effectiveTrapHours,
        countPerTrapHour:
          effectiveTrapHours > 0 ? observedCount / effectiveTrapHours : 0,
        rateDefined: effectiveTrapHours > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scheduledTrapHours: 24, rainoutTrapHours: 4, observedCount: 10 },
  output: { effectiveTrapHours: 20, countPerTrapHour: 0.5, rateDefined: true },
} satisfies ToolExample<Input, Output>;
export const pitfallTrapRainoutEffortCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/pitfall-trap-rainout-effort-correction",
    title: "Pitfall Trap Rainout Effort Correction Tool",
    description:
      "Remove explicit rainout trap-hours and report observed count rate; at zero effective effort the numeric placeholder is zero with rateDefined=false.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledTrapHours: { type: "number", minimum: 0 },
        rainoutTrapHours: { type: "number", minimum: 0 },
        observedCount: { type: "integer", minimum: 0 },
      },
      required: ["scheduledTrapHours", "rainoutTrapHours", "observedCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveTrapHours: { type: "number" },
        countPerTrapHour: { type: "number" },
        rateDefined: { type: "boolean" },
      },
      required: ["effectiveTrapHours", "countPerTrapHour", "rateDefined"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledTrapHours",
          label: "Scheduled Trap Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "rainoutTrapHours",
          label: "Rainout Trap Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedCount",
          label: "Observed Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "effectiveTrapHours",
          label: "Effective Trap Hours",
          valueType: { type: "number" },
        },
        {
          id: "countPerTrapHour",
          label: "Count Per Trap Hour",
          valueType: { type: "number" },
        },
        {
          id: "rateDefined",
          label: "Rate Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = pitfallTrapRainoutEffortCorrectionTool.execute;
export default pitfallTrapRainoutEffortCorrectionTool;
