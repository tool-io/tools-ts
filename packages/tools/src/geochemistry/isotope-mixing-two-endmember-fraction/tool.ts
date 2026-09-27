import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstRatio: number;
  readonly secondRatio: number;
  readonly firstConcentration: number;
  readonly secondConcentration: number;
  readonly firstMassFraction: number;
};
export type Output = {
  readonly mixedConcentration: number;
  readonly mixedRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstRatio: { type: "number", minimum: 0 },
    secondRatio: { type: "number", minimum: 0 },
    firstConcentration: { type: "number", minimum: 0 },
    secondConcentration: { type: "number", minimum: 0 },
    firstMassFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: [
    "firstRatio",
    "secondRatio",
    "firstConcentration",
    "secondConcentration",
    "firstMassFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    mixedConcentration: { type: "number" },
    mixedRatio: { type: "number" },
  },
  required: ["mixedConcentration", "mixedRatio"],
} as const;
/** Exact ratio mixing when concentrations measure denominator-isotope amount per mass, rather than total element concentration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstRatio,
    secondRatio,
    firstConcentration,
    secondConcentration,
    firstMassFraction,
  } = request;
  const compute = (): Output => {
    H.domain(
      firstRatio >= 0 &&
        secondRatio >= 0 &&
        firstConcentration >= 0 &&
        secondConcentration >= 0,
    );
    H.probability(firstMassFraction);
    H.domain(
      firstMassFraction * firstConcentration +
        (1 - firstMassFraction) * secondConcentration >
        0,
    );
    return {
      mixedConcentration:
        firstMassFraction * firstConcentration +
        (1 - firstMassFraction) * secondConcentration,
      mixedRatio:
        (firstMassFraction * firstConcentration * firstRatio +
          (1 - firstMassFraction) * secondConcentration * secondRatio) /
        (firstMassFraction * firstConcentration +
          (1 - firstMassFraction) * secondConcentration),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstRatio: 0.1,
    secondRatio: 0.2,
    firstConcentration: 2,
    secondConcentration: 1,
    firstMassFraction: 0.5,
  },
  output: { mixedConcentration: 1.5, mixedRatio: 0.13333333333333333 },
} satisfies ToolExample<Input, Output>;
export const isotopeMixingTwoEndmemberFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/isotope-mixing-two-endmember-fraction",
    title: "Isotope Mixing Two Endmember Fraction Tool",
    description:
      "Exact ratio mixing when concentrations measure denominator-isotope amount per mass, rather than total element concentration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstRatio: { type: "number", minimum: 0 },
        secondRatio: { type: "number", minimum: 0 },
        firstConcentration: { type: "number", minimum: 0 },
        secondConcentration: { type: "number", minimum: 0 },
        firstMassFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "firstRatio",
        "secondRatio",
        "firstConcentration",
        "secondConcentration",
        "firstMassFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        mixedConcentration: { type: "number" },
        mixedRatio: { type: "number" },
      },
      required: ["mixedConcentration", "mixedRatio"],
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
          id: "firstConcentration",
          label: "First Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondConcentration",
          label: "Second Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstMassFraction",
          label: "First Mass Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "mixedConcentration",
          label: "Mixed Concentration",
          valueType: { type: "number" },
        },
        {
          id: "mixedRatio",
          label: "Mixed Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = isotopeMixingTwoEndmemberFractionTool.execute;
export default isotopeMixingTwoEndmemberFractionTool;
