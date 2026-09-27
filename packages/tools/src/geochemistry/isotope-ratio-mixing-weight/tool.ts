import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRatio: number;
  readonly secondRatio: number;
  readonly firstDenominatorIsotopeAmount: number;
  readonly secondDenominatorIsotopeAmount: number;
};
export type Output = {
  readonly mixedRatio: number;
  readonly firstWeight: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRatio: { type: "number" },
    secondRatio: { type: "number" },
    firstDenominatorIsotopeAmount: { type: "number" },
    secondDenominatorIsotopeAmount: { type: "number" },
  },
  required: [
    "firstRatio",
    "secondRatio",
    "firstDenominatorIsotopeAmount",
    "secondDenominatorIsotopeAmount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mixedRatio: { type: "number" },
    firstWeight: { type: "number" },
  },
  required: ["mixedRatio", "firstWeight"],
} as const;
/** Mix isotope ratios using explicit denominator-isotope amounts, not bulk mass weights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstRatio,
    secondRatio,
    firstDenominatorIsotopeAmount,
    secondDenominatorIsotopeAmount,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstRatio >= 0 &&
        secondRatio >= 0 &&
        firstDenominatorIsotopeAmount >= 0 &&
        secondDenominatorIsotopeAmount >= 0 &&
        (firstDenominatorIsotopeAmount > 0 ||
          secondDenominatorIsotopeAmount > 0),
    );
    const scale = Math.max(
        firstDenominatorIsotopeAmount,
        secondDenominatorIsotopeAmount,
      ),
      a = firstDenominatorIsotopeAmount / scale,
      b = secondDenominatorIsotopeAmount / scale,
      total = a + b,
      firstWeight = a / total,
      secondWeight = b / total;
    return {
      mixedRatio:
        firstRatio <= secondRatio
          ? firstRatio + (secondRatio - firstRatio) * secondWeight
          : secondRatio + (firstRatio - secondRatio) * firstWeight,
      firstWeight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstRatio: 2,
    secondRatio: 4,
    firstDenominatorIsotopeAmount: 1,
    secondDenominatorIsotopeAmount: 3,
  },
  output: { mixedRatio: 3.5, firstWeight: 0.25 },
} satisfies ToolExample<Input, Output>;
export const isotopeRatioMixingWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/isotope-ratio-mixing-weight",
    title: "Isotope Ratio Mixing Weight Tool",
    description:
      "Mix isotope ratios using explicit denominator-isotope amounts, not bulk mass weights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRatio: { type: "number" },
        secondRatio: { type: "number" },
        firstDenominatorIsotopeAmount: { type: "number" },
        secondDenominatorIsotopeAmount: { type: "number" },
      },
      required: [
        "firstRatio",
        "secondRatio",
        "firstDenominatorIsotopeAmount",
        "secondDenominatorIsotopeAmount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mixedRatio: { type: "number" },
        firstWeight: { type: "number" },
      },
      required: ["mixedRatio", "firstWeight"],
    },
    ports: {
      inputs: [
        {
          id: "firstRatio",
          label: "First Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondRatio",
          label: "Second Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDenominatorIsotopeAmount",
          label: "First Denominator Isotope Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondDenominatorIsotopeAmount",
          label: "Second Denominator Isotope Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mixedRatio",
          label: "Mixed Ratio",
          valueType: { type: "number" },
        },
        {
          id: "firstWeight",
          label: "First Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = isotopeRatioMixingWeightTool.execute;
export default isotopeRatioMixingWeightTool;
