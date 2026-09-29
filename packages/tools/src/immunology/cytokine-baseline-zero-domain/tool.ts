import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly baseline: number; readonly observation: number };
export type Output = {
  readonly foldDefined: boolean;
  readonly fold: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { baseline: { type: "number" }, observation: { type: "number" } },
  required: ["baseline", "observation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    foldDefined: { type: "boolean" },
    fold: { type: "number" },
    difference: { type: "number" },
  },
  required: ["foldDefined", "fold", "difference"],
} as const;
/** Research ratio-domain bookkeeping without interpreting cytokine measurements. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseline, observation } = request;
  const compute = (): Output => {
    return {
      foldDefined: baseline !== 0,
      fold: baseline !== 0 ? observation / baseline : 0,
      difference: observation - baseline,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseline: 0, observation: 4 },
  output: { foldDefined: false, fold: 0, difference: 4 },
} satisfies ToolExample<Input, Output>;
export const cytokineBaselineZeroDomainTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "immunology/cytokine-baseline-zero-domain",
    title: "Cytokine Baseline Zero Domain Tool",
    description:
      "Research ratio-domain bookkeeping without interpreting cytokine measurements.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseline: { type: "number" },
        observation: { type: "number" },
      },
      required: ["baseline", "observation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        foldDefined: { type: "boolean" },
        fold: { type: "number" },
        difference: { type: "number" },
      },
      required: ["foldDefined", "fold", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "baseline",
          label: "Baseline",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observation",
          label: "Observation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "foldDefined",
          label: "Fold Defined",
          valueType: { type: "boolean" },
        },
        { id: "fold", label: "Fold", valueType: { type: "number" } },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cytokineBaselineZeroDomainTool.execute;
export default cytokineBaselineZeroDomainTool;
