import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly logSurvival: number };
export type Output = { readonly eventProbability: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logSurvival: { type: "number" } },
  required: ["logSurvival"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { eventProbability: { type: "number" } },
  required: ["eventProbability"],
} as const;
/** Compute rare event probability expm1 crosswalk from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { logSurvival } = input;
  const compute = (): Output => {
    domain(logSurvival <= 0);
    return { eventProbability: -Math.expm1(logSurvival) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { logSurvival: 0 },
  output: { eventProbability: 0 },
} satisfies ToolExample<Input, Output>;
export const rareEventProbabilityExpm1CrosswalkTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "probability/rare-event-probability-expm1-crosswalk",
  title: "Rare Event Probability Expm1 Crosswalk Tool",
  description:
    "Compute rare event probability expm1 crosswalk from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "logSurvival",
        label: "Log Survival",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "eventProbability",
        label: "Event Probability",
        valueType: { type: "number" },
      },
    ],
  },
});
export const run = rareEventProbabilityExpm1CrosswalkTool.execute;
export default rareEventProbabilityExpm1CrosswalkTool;
