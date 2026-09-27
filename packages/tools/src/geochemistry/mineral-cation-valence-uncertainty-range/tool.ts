import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cationCount: number;
  readonly minimumValence: number;
  readonly maximumValence: number;
  readonly knownPositiveCharge: number;
  readonly anionNegativeCharge: number;
};
export type Output = {
  readonly minimumPositiveCharge: number;
  readonly maximumPositiveCharge: number;
  readonly chargeBalancePossible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cationCount: { type: "number", minimum: 0 },
    minimumValence: { type: "number", minimum: 0 },
    maximumValence: { type: "number" },
    knownPositiveCharge: { type: "number", minimum: 0 },
    anionNegativeCharge: { type: "number", minimum: 0 },
  },
  required: [
    "cationCount",
    "minimumValence",
    "maximumValence",
    "knownPositiveCharge",
    "anionNegativeCharge",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    minimumPositiveCharge: { type: "number" },
    maximumPositiveCharge: { type: "number" },
    chargeBalancePossible: { type: "boolean" },
  },
  required: [
    "minimumPositiveCharge",
    "maximumPositiveCharge",
    "chargeBalancePossible",
  ],
} as const;
/** Continuous valence-mixture charge range; does not assert that intermediate integer valence states exist. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    cationCount,
    minimumValence,
    maximumValence,
    knownPositiveCharge,
    anionNegativeCharge,
  } = request;
  const compute = (): Output => {
    H.domain(
      cationCount >= 0 &&
        minimumValence >= 0 &&
        maximumValence >= minimumValence &&
        knownPositiveCharge >= 0 &&
        anionNegativeCharge >= 0,
    );
    return {
      minimumPositiveCharge: knownPositiveCharge + cationCount * minimumValence,
      maximumPositiveCharge: knownPositiveCharge + cationCount * maximumValence,
      chargeBalancePossible:
        anionNegativeCharge >=
          knownPositiveCharge + cationCount * minimumValence &&
        anionNegativeCharge <=
          knownPositiveCharge + cationCount * maximumValence,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cationCount: 2,
    minimumValence: 2,
    maximumValence: 3,
    knownPositiveCharge: 4,
    anionNegativeCharge: 9,
  },
  output: {
    minimumPositiveCharge: 8,
    maximumPositiveCharge: 10,
    chargeBalancePossible: true,
  },
} satisfies ToolExample<Input, Output>;
export const mineralCationValenceUncertaintyRangeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/mineral-cation-valence-uncertainty-range",
      title: "Mineral Cation Valence Uncertainty Range Tool",
      description:
        "Continuous valence-mixture charge range; does not assert that intermediate integer valence states exist.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cationCount: { type: "number", minimum: 0 },
          minimumValence: { type: "number", minimum: 0 },
          maximumValence: { type: "number" },
          knownPositiveCharge: { type: "number", minimum: 0 },
          anionNegativeCharge: { type: "number", minimum: 0 },
        },
        required: [
          "cationCount",
          "minimumValence",
          "maximumValence",
          "knownPositiveCharge",
          "anionNegativeCharge",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          minimumPositiveCharge: { type: "number" },
          maximumPositiveCharge: { type: "number" },
          chargeBalancePossible: { type: "boolean" },
        },
        required: [
          "minimumPositiveCharge",
          "maximumPositiveCharge",
          "chargeBalancePossible",
        ],
      },
      ports: {
        inputs: [
          {
            id: "cationCount",
            label: "Cation Count",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "minimumValence",
            label: "Minimum Valence",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "maximumValence",
            label: "Maximum Valence",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "knownPositiveCharge",
            label: "Known Positive Charge",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "anionNegativeCharge",
            label: "Anion Negative Charge",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "minimumPositiveCharge",
            label: "Minimum Positive Charge",
            valueType: { type: "number" },
          },
          {
            id: "maximumPositiveCharge",
            label: "Maximum Positive Charge",
            valueType: { type: "number" },
          },
          {
            id: "chargeBalancePossible",
            label: "Charge Balance Possible",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = mineralCationValenceUncertaintyRangeTool.execute;
export default mineralCationValenceUncertaintyRangeTool;
