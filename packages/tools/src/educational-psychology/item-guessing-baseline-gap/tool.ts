import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedSuccess: number;
  readonly suppliedGuessProbability: number;
};
export type Output = {
  readonly rawGap: number;
  readonly normalizedGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedSuccess: { type: "number", minimum: 0, maximum: 1 },
    suppliedGuessProbability: {
      type: "number",
      minimum: 0,
      exclusiveMaximum: 1,
    },
  },
  required: ["observedSuccess", "suppliedGuessProbability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rawGap: { type: "number" }, normalizedGap: { type: "number" } },
  required: ["rawGap", "normalizedGap"],
} as const;
/** Calculate item guessing baseline gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedSuccess, suppliedGuessProbability } = request;
  const compute = (): Output => {
    H.probability(observedSuccess);
    H.domain(suppliedGuessProbability >= 0 && suppliedGuessProbability < 1);
    return {
      rawGap: observedSuccess - suppliedGuessProbability,
      normalizedGap:
        (observedSuccess - suppliedGuessProbability) /
        (1 - suppliedGuessProbability),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedSuccess: 0.75, suppliedGuessProbability: 0.25 },
  output: { rawGap: 0.5, normalizedGap: 0.6666666666666666 },
} satisfies ToolExample<Input, Output>;
export const itemGuessingBaselineGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "educational-psychology/item-guessing-baseline-gap",
    title: "Item Guessing Baseline Gap Tool",
    description:
      "Calculate item guessing baseline gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedSuccess: { type: "number", minimum: 0, maximum: 1 },
        suppliedGuessProbability: {
          type: "number",
          minimum: 0,
          exclusiveMaximum: 1,
        },
      },
      required: ["observedSuccess", "suppliedGuessProbability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawGap: { type: "number" },
        normalizedGap: { type: "number" },
      },
      required: ["rawGap", "normalizedGap"],
    },
    ports: {
      inputs: [
        {
          id: "observedSuccess",
          label: "Observed Success",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGuessProbability",
          label: "Supplied Guess Probability",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        { id: "rawGap", label: "Raw Gap", valueType: { type: "number" } },
        {
          id: "normalizedGap",
          label: "Normalized Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = itemGuessingBaselineGapTool.execute;
export default itemGuessingBaselineGapTool;
