import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly baseline: number; readonly observation: number };
export type Output = {
  readonly ratioDefined: boolean;
  readonly ratio: number;
  readonly logRatioDefined: boolean;
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
    ratioDefined: { type: "boolean" },
    ratio: { type: "number" },
    logRatioDefined: { type: "boolean" },
  },
  required: ["ratioDefined", "ratio", "logRatioDefined"],
} as const;
/** Report ratio/log-ratio domain flags for supplied research measurements; no clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseline, observation } = request;
  const compute = (): Output => {
    return {
      ratioDefined: baseline !== 0,
      ratio: baseline !== 0 ? observation / baseline : 0,
      logRatioDefined: baseline !== 0 && observation / baseline > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseline: 0, observation: 2 },
  output: { ratioDefined: false, ratio: 0, logRatioDefined: false },
} satisfies ToolExample<Input, Output>;
export const researchBaselineZeroDomainTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "endocrinology/research-baseline-zero-domain",
    title: "Research Baseline Zero Domain Tool",
    description:
      "Report ratio/log-ratio domain flags for supplied research measurements; no clinical interpretation.",
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
        ratioDefined: { type: "boolean" },
        ratio: { type: "number" },
        logRatioDefined: { type: "boolean" },
      },
      required: ["ratioDefined", "ratio", "logRatioDefined"],
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
          id: "ratioDefined",
          label: "Ratio Defined",
          valueType: { type: "boolean" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "logRatioDefined",
          label: "Log Ratio Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchBaselineZeroDomainTool.execute;
export default researchBaselineZeroDomainTool;
