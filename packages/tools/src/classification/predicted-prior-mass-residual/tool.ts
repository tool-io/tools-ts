import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly predictedFractions: readonly number[];
  readonly suppliedPriorFractions: readonly number[];
};
export type Output = {
  readonly residuals: readonly number[];
  readonly predictedTotal: number;
  readonly priorTotal: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    suppliedPriorFractions: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
  },
  required: ["predictedFractions", "suppliedPriorFractions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residuals: { type: "array", maxItems: 256, items: { type: "number" } },
    predictedTotal: { type: "number" },
    priorTotal: { type: "number" },
  },
  required: ["residuals", "predictedTotal", "priorTotal"],
} as const;
/** Compare supplied candidate class masses without normalizing them or asserting calibration. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { predictedFractions, suppliedPriorFractions } = request;
  const compute = (): Output => {
    H.sameLength(predictedFractions, suppliedPriorFractions);
    H.domain(
      [...predictedFractions, ...suppliedPriorFractions].every(
        (x) => x >= 0 && x <= 1,
      ),
    );
    return {
      residuals: predictedFractions.map(
        (x, i) => x - suppliedPriorFractions[i],
      ),
      predictedTotal: predictedFractions.reduce((a, b) => a + b, 0),
      priorTotal: suppliedPriorFractions.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    predictedFractions: [0.25, 0.75],
    suppliedPriorFractions: [0.5, 0.5],
  },
  output: { residuals: [-0.25, 0.25], predictedTotal: 1, priorTotal: 1 },
} satisfies ToolExample<Input, Output>;
export const predictedPriorMassResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "classification/predicted-prior-mass-residual",
    title: "Predicted Prior Mass Residual Tool",
    description:
      "Compare supplied candidate class masses without normalizing them or asserting calibration.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        suppliedPriorFractions: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["predictedFractions", "suppliedPriorFractions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residuals: { type: "array", maxItems: 256, items: { type: "number" } },
        predictedTotal: { type: "number" },
        priorTotal: { type: "number" },
      },
      required: ["residuals", "predictedTotal", "priorTotal"],
    },
    ports: {
      inputs: [
        {
          id: "predictedFractions",
          label: "Predicted Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "suppliedPriorFractions",
          label: "Supplied Prior Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "residuals",
          label: "Residuals",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "predictedTotal",
          label: "Predicted Total",
          valueType: { type: "number" },
        },
        {
          id: "priorTotal",
          label: "Prior Total",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = predictedPriorMassResidualTool.execute;
export default predictedPriorMassResidualTool;
