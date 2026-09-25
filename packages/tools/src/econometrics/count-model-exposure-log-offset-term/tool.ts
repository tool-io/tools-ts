import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly linearPredictor: number;
  readonly exposure: number;
};
export type Output = {
  readonly logOffset: number;
  readonly expectedCount: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    linearPredictor: { type: "number" },
    exposure: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["linearPredictor", "exposure"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logOffset: { type: "number" },
    expectedCount: { type: "number" },
  },
  required: ["logOffset", "expectedCount"],
} as const;
/** Calculate count model exposure log offset term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { linearPredictor, exposure } = request;
  const compute = (): Output => {
    H.positive(exposure);
    return {
      logOffset: Math.log(exposure),
      expectedCount: exposure * Math.exp(linearPredictor),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { linearPredictor: 0.6931471805599453, exposure: 3 },
  output: { logOffset: 1.0986122886681096, expectedCount: 6 },
} satisfies ToolExample<Input, Output>;
export const countModelExposureLogOffsetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/count-model-exposure-log-offset-term",
    title: "Count Model Exposure Log Offset Term Tool",
    description:
      "Calculate count model exposure log offset term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        linearPredictor: { type: "number" },
        exposure: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["linearPredictor", "exposure"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logOffset: { type: "number" },
        expectedCount: { type: "number" },
      },
      required: ["logOffset", "expectedCount"],
    },
    ports: {
      inputs: [
        {
          id: "linearPredictor",
          label: "Linear Predictor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exposure",
          label: "Exposure",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logOffset", label: "Log Offset", valueType: { type: "number" } },
        {
          id: "expectedCount",
          label: "Expected Count",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = countModelExposureLogOffsetTermTool.execute;
export default countModelExposureLogOffsetTermTool;
