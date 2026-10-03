import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedWeight: number;
  readonly missingWeight: number;
  readonly observedMean: number;
  readonly missingLower: number;
  readonly missingUpper: number;
};
export type Output = { readonly lowerMean: number; readonly upperMean: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedWeight: { type: "number", minimum: 0 },
    missingWeight: { type: "number", minimum: 0 },
    observedMean: { type: "number" },
    missingLower: { type: "number" },
    missingUpper: { type: "number" },
  },
  required: [
    "observedWeight",
    "missingWeight",
    "observedMean",
    "missingLower",
    "missingUpper",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lowerMean: { type: "number" }, upperMean: { type: "number" } },
  required: ["lowerMean", "upperMean"],
} as const;
/** Calculate weighted mean missing weight budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    observedWeight,
    missingWeight,
    observedMean,
    missingLower,
    missingUpper,
  } = request;
  const compute = (): Output => {
    H.domain(
      observedWeight >= 0 && missingWeight >= 0 && missingLower <= missingUpper,
    );
    const total = observedWeight + missingWeight;
    H.positive(total);
    return {
      lowerMean:
        (observedWeight * observedMean + missingWeight * missingLower) / total,
      upperMean:
        (observedWeight * observedMean + missingWeight * missingUpper) / total,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedWeight: 8,
    missingWeight: 2,
    observedMean: 5,
    missingLower: 0,
    missingUpper: 10,
  },
  output: { lowerMean: 4, upperMean: 6 },
} satisfies ToolExample<Input, Output>;
export const weightedMeanMissingWeightBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "statistics/weighted-mean-missing-weight-budget",
    title: "Weighted Mean Missing Weight Budget Tool",
    description:
      "Calculate weighted mean missing weight budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedWeight: { type: "number", minimum: 0 },
        missingWeight: { type: "number", minimum: 0 },
        observedMean: { type: "number" },
        missingLower: { type: "number" },
        missingUpper: { type: "number" },
      },
      required: [
        "observedWeight",
        "missingWeight",
        "observedMean",
        "missingLower",
        "missingUpper",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerMean: { type: "number" },
        upperMean: { type: "number" },
      },
      required: ["lowerMean", "upperMean"],
    },
    ports: {
      inputs: [
        {
          id: "observedWeight",
          label: "Observed Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missingWeight",
          label: "Missing Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observedMean",
          label: "Observed Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missingLower",
          label: "Missing Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missingUpper",
          label: "Missing Upper",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lowerMean", label: "Lower Mean", valueType: { type: "number" } },
        { id: "upperMean", label: "Upper Mean", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = weightedMeanMissingWeightBudgetTool.execute;
export default weightedMeanMissingWeightBudgetTool;
