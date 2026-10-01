import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedVolume: number;
  readonly missingSeconds: number;
  readonly suppliedFlow: number;
  readonly imputeMissing: boolean;
};
export type Output = {
  readonly conditionalVolume: number;
  readonly imputedVolume: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedVolume: { type: "number", minimum: 0 },
    missingSeconds: { type: "number", minimum: 0 },
    suppliedFlow: { type: "number", minimum: 0 },
    imputeMissing: { type: "boolean" },
  },
  required: [
    "recordedVolume",
    "missingSeconds",
    "suppliedFlow",
    "imputeMissing",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    conditionalVolume: { type: "number" },
    imputedVolume: { type: "number" },
  },
  required: ["conditionalVolume", "imputedVolume"],
} as const;
/** Show an explicitly selected constant-flow bench imputation scenario, not a dialysis prescription or adequacy result. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedVolume, missingSeconds, suppliedFlow, imputeMissing } =
    request;
  const compute = (): Output => {
    H.domain(recordedVolume >= 0 && missingSeconds >= 0 && suppliedFlow >= 0);
    return {
      conditionalVolume:
        recordedVolume + (imputeMissing ? missingSeconds * suppliedFlow : 0),
      imputedVolume: imputeMissing ? missingSeconds * suppliedFlow : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordedVolume: 100,
    missingSeconds: 5,
    suppliedFlow: 2,
    imputeMissing: true,
  },
  output: { conditionalVolume: 110, imputedVolume: 10 },
} satisfies ToolExample<Input, Output>;
export const dialysisBenchMissingFlowTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nephrology/dialysis-bench-missing-flow-term",
    title: "Dialysis Bench Missing Flow Term Tool",
    description:
      "Show an explicitly selected constant-flow bench imputation scenario, not a dialysis prescription or adequacy result.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedVolume: { type: "number", minimum: 0 },
        missingSeconds: { type: "number", minimum: 0 },
        suppliedFlow: { type: "number", minimum: 0 },
        imputeMissing: { type: "boolean" },
      },
      required: [
        "recordedVolume",
        "missingSeconds",
        "suppliedFlow",
        "imputeMissing",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        conditionalVolume: { type: "number" },
        imputedVolume: { type: "number" },
      },
      required: ["conditionalVolume", "imputedVolume"],
    },
    ports: {
      inputs: [
        {
          id: "recordedVolume",
          label: "Recorded Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "missingSeconds",
          label: "Missing Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedFlow",
          label: "Supplied Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "imputeMissing",
          label: "Impute Missing",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "conditionalVolume",
          label: "Conditional Volume",
          valueType: { type: "number" },
        },
        {
          id: "imputedVolume",
          label: "Imputed Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dialysisBenchMissingFlowTermTool.execute;
export default dialysisBenchMissingFlowTermTool;
