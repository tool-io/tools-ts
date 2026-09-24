import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stoichiometricCoefficients: readonly number[];
  readonly reactionExtents: readonly number[];
  readonly observedChange: number;
};
export type Output = {
  readonly predictedChange: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stoichiometricCoefficients: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    reactionExtents: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    observedChange: { type: "number" },
  },
  required: ["stoichiometricCoefficients", "reactionExtents", "observedChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedChange: { type: "number" },
    residual: { type: "number" },
  },
  required: ["predictedChange", "residual"],
} as const;
/** Check one supplied species row against explicit reaction extents without constructing a biological mechanism. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stoichiometricCoefficients, reactionExtents, observedChange } =
    request;
  const compute = (): Output => {
    H.sameLength(stoichiometricCoefficients, reactionExtents);
    return (() => {
      const predictedChange = stoichiometricCoefficients.reduce(
        (s, x, i) => s + x * reactionExtents[i],
        0,
      );
      return { predictedChange, residual: observedChange - predictedChange };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stoichiometricCoefficients: [-1, 2],
    reactionExtents: [3, 4],
    observedChange: 6,
  },
  output: { predictedChange: 5, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const stoichiometricSpeciesBalanceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/stoichiometric-species-balance-gap",
    title: "Stoichiometric Species Balance Gap Tool",
    description:
      "Check one supplied species row against explicit reaction extents without constructing a biological mechanism.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stoichiometricCoefficients: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        reactionExtents: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        observedChange: { type: "number" },
      },
      required: [
        "stoichiometricCoefficients",
        "reactionExtents",
        "observedChange",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedChange: { type: "number" },
        residual: { type: "number" },
      },
      required: ["predictedChange", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "stoichiometricCoefficients",
          label: "Stoichiometric Coefficients",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "reactionExtents",
          label: "Reaction Extents",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "observedChange",
          label: "Observed Change",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "predictedChange",
          label: "Predicted Change",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stoichiometricSpeciesBalanceGapTool.execute;
export default stoichiometricSpeciesBalanceGapTool;
