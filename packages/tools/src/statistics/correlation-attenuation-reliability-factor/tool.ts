import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly firstReliability: number;
  readonly secondReliability: number;
};
export type Output = {
  readonly corrected: number;
  readonly withinCorrelationRange: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number", minimum: -1, maximum: 1 },
    firstReliability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    secondReliability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["observed", "firstReliability", "secondReliability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    corrected: { type: "number" },
    withinCorrelationRange: { type: "boolean" },
  },
  required: ["corrected", "withinCorrelationRange"],
} as const;
/** Calculate correlation attenuation reliability factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, firstReliability, secondReliability } = request;
  const compute = (): Output => {
    H.domain(observed >= -1 && observed <= 1);
    H.domain(
      firstReliability > 0 &&
        firstReliability <= 1 &&
        secondReliability > 0 &&
        secondReliability <= 1,
    );
    const corrected =
      observed / Math.sqrt(firstReliability * secondReliability);
    return { corrected, withinCorrelationRange: Math.abs(corrected) <= 1 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 0.4, firstReliability: 0.64, secondReliability: 1 },
  output: { corrected: 0.5, withinCorrelationRange: true },
} satisfies ToolExample<Input, Output>;
export const correlationAttenuationReliabilityFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "statistics/correlation-attenuation-reliability-factor",
      title: "Correlation Attenuation Reliability Factor Tool",
      description:
        "Calculate correlation attenuation reliability factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "number", minimum: -1, maximum: 1 },
          firstReliability: { type: "number", exclusiveMinimum: 0, maximum: 1 },
          secondReliability: {
            type: "number",
            exclusiveMinimum: 0,
            maximum: 1,
          },
        },
        required: ["observed", "firstReliability", "secondReliability"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          corrected: { type: "number" },
          withinCorrelationRange: { type: "boolean" },
        },
        required: ["corrected", "withinCorrelationRange"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstReliability",
            label: "First Reliability",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondReliability",
            label: "Second Reliability",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "corrected",
            label: "Corrected",
            valueType: { type: "number" },
          },
          {
            id: "withinCorrelationRange",
            label: "Within Correlation Range",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = correlationAttenuationReliabilityFactorTool.execute;
export default correlationAttenuationReliabilityFactorTool;
