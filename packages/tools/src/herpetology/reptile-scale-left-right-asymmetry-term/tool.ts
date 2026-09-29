import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly leftCount: number;
  readonly rightCount: number;
  readonly missingLeft: number;
  readonly missingRight: number;
};
export type Output = {
  readonly observedDifference: number;
  readonly completeSides: boolean;
  readonly normalizedDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leftCount: { type: "integer", minimum: 0 },
    rightCount: { type: "integer", minimum: 0 },
    missingLeft: { type: "integer", minimum: 0 },
    missingRight: { type: "integer", minimum: 0 },
  },
  required: ["leftCount", "rightCount", "missingLeft", "missingRight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedDifference: { type: "integer" },
    completeSides: { type: "boolean" },
    normalizedDifference: { type: "number" },
  },
  required: ["observedDifference", "completeSides", "normalizedDifference"],
} as const;
/** Signed bilateral count asymmetry with separate unobserved-side counts, without treating missing scales as measured zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftCount, rightCount, missingLeft, missingRight } = request;
  const compute = (): Output => {
    H.integer(leftCount, 0);
    H.integer(rightCount, 0);
    H.integer(missingLeft, 0);
    H.integer(missingRight, 0);
    H.domain(leftCount + rightCount > 0);
    return {
      observedDifference: leftCount - rightCount,
      completeSides: missingLeft === 0 && missingRight === 0,
      normalizedDifference: (leftCount - rightCount) / (leftCount + rightCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftCount: 12, rightCount: 10, missingLeft: 0, missingRight: 0 },
  output: {
    observedDifference: 2,
    completeSides: true,
    normalizedDifference: 0.09090909090909091,
  },
} satisfies ToolExample<Input, Output>;
export const reptileScaleLeftRightAsymmetryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "herpetology/reptile-scale-left-right-asymmetry-term",
    title: "Reptile Scale Left Right Asymmetry Term Tool",
    description:
      "Signed bilateral count asymmetry with separate unobserved-side counts, without treating missing scales as measured zeros.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leftCount: { type: "integer", minimum: 0 },
        rightCount: { type: "integer", minimum: 0 },
        missingLeft: { type: "integer", minimum: 0 },
        missingRight: { type: "integer", minimum: 0 },
      },
      required: ["leftCount", "rightCount", "missingLeft", "missingRight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedDifference: { type: "integer" },
        completeSides: { type: "boolean" },
        normalizedDifference: { type: "number" },
      },
      required: ["observedDifference", "completeSides", "normalizedDifference"],
    },
    ports: {
      inputs: [
        {
          id: "leftCount",
          label: "Left Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rightCount",
          label: "Right Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "missingLeft",
          label: "Missing Left",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "missingRight",
          label: "Missing Right",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "observedDifference",
          label: "Observed Difference",
          valueType: { type: "integer" },
        },
        {
          id: "completeSides",
          label: "Complete Sides",
          valueType: { type: "boolean" },
        },
        {
          id: "normalizedDifference",
          label: "Normalized Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = reptileScaleLeftRightAsymmetryTermTool.execute;
export default reptileScaleLeftRightAsymmetryTermTool;
