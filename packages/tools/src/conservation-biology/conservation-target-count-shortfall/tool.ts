import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly targetCount: number;
  readonly observedCount: number;
};
export type Output = {
  readonly shortfall: number;
  readonly targetMet: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetCount: { type: "integer", minimum: 0 },
    observedCount: { type: "integer", minimum: 0 },
  },
  required: ["targetCount", "observedCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shortfall: { type: "integer" },
    targetMet: { type: "boolean" },
  },
  required: ["shortfall", "targetMet"],
} as const;
/** Compare explicit conservation target and observed counts without estimating population viability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { targetCount, observedCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(targetCount) &&
        targetCount >= 0 &&
        targetCount <= Number.MAX_SAFE_INTEGER,
      "targetCount",
    ),
      targetCount);
    (H.domain(
      Number.isSafeInteger(observedCount) &&
        observedCount >= 0 &&
        observedCount <= Number.MAX_SAFE_INTEGER,
      "observedCount",
    ),
      observedCount);
    return {
      shortfall: Math.max(0, targetCount - observedCount),
      targetMet: observedCount >= targetCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { targetCount: 20, observedCount: 15 },
  output: { shortfall: 5, targetMet: false },
} satisfies ToolExample<Input, Output>;
export const conservationTargetCountShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["conservation-biology", "conservation biology", "biology"],
      keywords: ["conservation biology", "biology"],
    },
    id: "conservation-biology/conservation-target-count-shortfall",
    title: "Conservation Target Count Shortfall",
    description:
      "Compare explicit conservation target and observed counts without estimating population viability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetCount: { type: "integer", minimum: 0 },
        observedCount: { type: "integer", minimum: 0 },
      },
      required: ["targetCount", "observedCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "integer" },
        targetMet: { type: "boolean" },
      },
      required: ["shortfall", "targetMet"],
    },
    ports: {
      inputs: [
        {
          id: "targetCount",
          label: "Target Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observedCount",
          label: "Observed Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "integer" } },
        {
          id: "targetMet",
          label: "Target Met",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = conservationTargetCountShortfallTool.execute;
export default conservationTargetCountShortfallTool;
