import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exposure: number;
  readonly meanExposure: number;
  readonly factorReturn: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposure: { type: "number" },
    meanExposure: { type: "number" },
    factorReturn: { type: "number" },
  },
  required: ["exposure", "meanExposure", "factorReturn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate factor exposure centered term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exposure, meanExposure, factorReturn } = request;
  const compute = (): Output => {
    return { contribution: (exposure - meanExposure) * factorReturn };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exposure: 2, meanExposure: 1, factorReturn: 0.1 },
  output: { contribution: 0.1 },
} satisfies ToolExample<Input, Output>;
export const factorExposureCenteredTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/factor-exposure-centered-term",
    title: "Factor Exposure Centered Term Tool",
    description:
      "Calculate factor exposure centered term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposure: { type: "number" },
        meanExposure: { type: "number" },
        factorReturn: { type: "number" },
      },
      required: ["exposure", "meanExposure", "factorReturn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "exposure",
          label: "Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "meanExposure",
          label: "Mean Exposure",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "factorReturn",
          label: "Factor Return",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = factorExposureCenteredTermTool.execute;
export default factorExposureCenteredTermTool;
