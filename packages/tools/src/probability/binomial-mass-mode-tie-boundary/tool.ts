import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly trials: number; readonly probability: number };
export type Output = {
  readonly lowerMode: number;
  readonly upperMode: number;
  readonly tied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    trials: { type: "integer", minimum: 0, maximum: 1000000 },
    probability: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["trials", "probability"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lowerMode: { type: "integer" },
    upperMode: { type: "integer" },
    tied: { type: "boolean" },
  },
  required: ["lowerMode", "upperMode", "tied"],
} as const;
/** Calculate binomial mass mode tie boundary from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { trials, probability } = request;
  const compute = (): Output => {
    H.integer(trials, 0, 1000000);
    H.probability(probability);
    const a = (trials + 1) * probability,
      tied = Number.isInteger(a) && a > 0 && a <= trials;
    return {
      lowerMode: Math.min(trials, Math.max(0, Math.ceil(a) - 1)),
      upperMode: Math.min(trials, Math.floor(a)),
      tied,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { trials: 3, probability: 0.5 },
  output: { lowerMode: 1, upperMode: 2, tied: true },
} satisfies ToolExample<Input, Output>;
export const binomialMassModeTieBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/binomial-mass-mode-tie-boundary",
    title: "Binomial Mass Mode Tie Boundary Tool",
    description:
      "Calculate binomial mass mode tie boundary from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        trials: { type: "integer", minimum: 0, maximum: 1000000 },
        probability: { type: "number", minimum: 0, maximum: 1 },
      },
      required: ["trials", "probability"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lowerMode: { type: "integer" },
        upperMode: { type: "integer" },
        tied: { type: "boolean" },
      },
      required: ["lowerMode", "upperMode", "tied"],
    },
    ports: {
      inputs: [
        {
          id: "trials",
          label: "Trials",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "probability",
          label: "Probability",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "lowerMode",
          label: "Lower Mode",
          valueType: { type: "integer" },
        },
        {
          id: "upperMode",
          label: "Upper Mode",
          valueType: { type: "integer" },
        },
        { id: "tied", label: "Tied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = binomialMassModeTieBoundaryTool.execute;
export default binomialMassModeTieBoundaryTool;
