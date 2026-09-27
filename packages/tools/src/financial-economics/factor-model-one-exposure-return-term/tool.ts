import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly exposure: number;
  readonly factorReturn: number;
  readonly exposureChange: number;
};
export type Output = {
  readonly currentContribution: number;
  readonly changeContribution: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exposure: { type: "number" },
    factorReturn: { type: "number" },
    exposureChange: { type: "number" },
  },
  required: ["exposure", "factorReturn", "exposureChange"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    currentContribution: { type: "number" },
    changeContribution: { type: "number" },
  },
  required: ["currentContribution", "changeContribution"],
} as const;
/** Calculate factor model one exposure return term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { exposure, factorReturn, exposureChange } = request;
  const compute = (): Output => {
    return {
      currentContribution: exposure * factorReturn,
      changeContribution: exposureChange * factorReturn,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { exposure: 1.2, factorReturn: 0.05, exposureChange: 0.2 },
  output: {
    currentContribution: 0.06,
    changeContribution: 0.010000000000000002,
  },
} satisfies ToolExample<Input, Output>;
export const factorModelOneExposureReturnTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "financial-economics/factor-model-one-exposure-return-term",
    title: "Factor Model One Exposure Return Term Tool",
    description:
      "Calculate factor model one exposure return term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exposure: { type: "number" },
        factorReturn: { type: "number" },
        exposureChange: { type: "number" },
      },
      required: ["exposure", "factorReturn", "exposureChange"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        currentContribution: { type: "number" },
        changeContribution: { type: "number" },
      },
      required: ["currentContribution", "changeContribution"],
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
          id: "factorReturn",
          label: "Factor Return",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposureChange",
          label: "Exposure Change",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "currentContribution",
          label: "Current Contribution",
          valueType: { type: "number" },
        },
        {
          id: "changeContribution",
          label: "Change Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = factorModelOneExposureReturnTermTool.execute;
export default factorModelOneExposureReturnTermTool;
