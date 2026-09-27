import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probabilities: readonly number[];
  readonly profitableDeviation: readonly boolean[];
};
export type Output = {
  readonly deviationMass: number;
  readonly totalMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
    profitableDeviation: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["probabilities", "profitableDeviation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviationMass: { type: "number" },
    totalMass: { type: "number" },
  },
  required: ["deviationMass", "totalMass"],
} as const;
/** Sum supplied strategy mass on independently classified profitable deviations without computing payoffs or equilibria. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probabilities, profitableDeviation } = request;
  const compute = (): Output => {
    H.sameLength(probabilities, profitableDeviation);
    H.domain(probabilities.every((x) => x >= 0 && x <= 1));
    return {
      deviationMass: probabilities.reduce(
        (a, b, i) => a + (profitableDeviation[i] ? b : 0),
        0,
      ),
      totalMass: probabilities.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    probabilities: [0.2, 0.3, 0.5],
    profitableDeviation: [false, true, true],
  },
  output: { deviationMass: 0.8, totalMass: 1 },
} satisfies ToolExample<Input, Output>;
export const mixedDeviationSupportMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/mixed-deviation-support-mass",
    title: "Mixed Deviation Support Mass Tool",
    description:
      "Sum supplied strategy mass on independently classified profitable deviations without computing payoffs or equilibria.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        profitableDeviation: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["probabilities", "profitableDeviation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deviationMass: { type: "number" },
        totalMass: { type: "number" },
      },
      required: ["deviationMass", "totalMass"],
    },
    ports: {
      inputs: [
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "profitableDeviation",
          label: "Profitable Deviation",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "deviationMass",
          label: "Deviation Mass",
          valueType: { type: "number" },
        },
        { id: "totalMass", label: "Total Mass", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = mixedDeviationSupportMassTool.execute;
export default mixedDeviationSupportMassTool;
