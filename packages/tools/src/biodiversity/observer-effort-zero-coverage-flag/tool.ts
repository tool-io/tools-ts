import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observations: number;
  readonly effort: number;
  readonly coveredFraction: number;
};
export type Output = {
  readonly effectiveEffort: number;
  readonly rateDefined: boolean;
  readonly rate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observations: { type: "integer", minimum: 0 },
    effort: { type: "number", minimum: 0 },
    coveredFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["observations", "effort", "coveredFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveEffort: { type: "number" },
    rateDefined: { type: "boolean" },
    rate: { type: "number" },
  },
  required: ["effectiveEffort", "rateDefined", "rate"],
} as const;
/** Calculate observer effort zero coverage flag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observations, effort, coveredFraction } = request;
  const compute = (): Output => {
    H.integer(observations, 0);
    H.domain(effort >= 0);
    H.probability(coveredFraction);
    return {
      effectiveEffort: effort * coveredFraction,
      rateDefined: effort * coveredFraction > 0,
      rate:
        effort * coveredFraction > 0
          ? observations / (effort * coveredFraction)
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observations: 3, effort: 10, coveredFraction: 0 },
  output: { effectiveEffort: 0, rateDefined: false, rate: 0 },
} satisfies ToolExample<Input, Output>;
export const observerEffortZeroCoverageFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/observer-effort-zero-coverage-flag",
    title: "Observer Effort Zero Coverage Flag Tool",
    description:
      "Calculate observer effort zero coverage flag from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observations: { type: "integer", minimum: 0 },
        effort: { type: "number", minimum: 0 },
        coveredFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["observations", "effort", "coveredFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveEffort: { type: "number" },
        rateDefined: { type: "boolean" },
        rate: { type: "number" },
      },
      required: ["effectiveEffort", "rateDefined", "rate"],
    },
    ports: {
      inputs: [
        {
          id: "observations",
          label: "Observations",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "effort",
          label: "Effort",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coveredFraction",
          label: "Covered Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "effectiveEffort",
          label: "Effective Effort",
          valueType: { type: "number" },
        },
        {
          id: "rateDefined",
          label: "Rate Defined",
          valueType: { type: "boolean" },
        },
        { id: "rate", label: "Rate", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = observerEffortZeroCoverageFlagTool.execute;
export default observerEffortZeroCoverageFlagTool;
