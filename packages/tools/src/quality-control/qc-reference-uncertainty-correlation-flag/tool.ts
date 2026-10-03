import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultUncertainty: number;
  readonly referenceUncertainty: number;
  readonly suppliedCorrelation: number;
  readonly useCorrelation: boolean;
};
export type Output = { readonly differenceUncertainty: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultUncertainty: { type: "number", minimum: 0 },
    referenceUncertainty: { type: "number", minimum: 0 },
    suppliedCorrelation: { type: "number", minimum: -1, maximum: 1 },
    useCorrelation: { type: "boolean" },
  },
  required: [
    "resultUncertainty",
    "referenceUncertainty",
    "suppliedCorrelation",
    "useCorrelation",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { differenceUncertainty: { type: "number" } },
  required: ["differenceUncertainty"],
} as const;
/** Combine supplied standard uncertainties of a difference using an explicit correlation assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    resultUncertainty,
    referenceUncertainty,
    suppliedCorrelation,
    useCorrelation,
  } = request;
  const compute = (): Output => {
    H.domain(
      resultUncertainty >= 0 &&
        referenceUncertainty >= 0 &&
        suppliedCorrelation >= -1 &&
        suppliedCorrelation <= 1,
    );
    const rho = useCorrelation ? suppliedCorrelation : 0;
    return {
      differenceUncertainty:
        rho === 0
          ? Math.hypot(resultUncertainty, referenceUncertainty)
          : Math.hypot(
              resultUncertainty - referenceUncertainty,
              Math.sqrt(2 * (1 - rho)) *
                Math.sqrt(resultUncertainty) *
                Math.sqrt(referenceUncertainty),
            ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultUncertainty: 3,
    referenceUncertainty: 4,
    suppliedCorrelation: 1,
    useCorrelation: true,
  },
  output: { differenceUncertainty: 1 },
} satisfies ToolExample<Input, Output>;
export const qcReferenceUncertaintyCorrelationFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-control/qc-reference-uncertainty-correlation-flag",
      title: "QC Reference Uncertainty Correlation Flag Tool",
      description:
        "Combine supplied standard uncertainties of a difference using an explicit correlation assumption.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resultUncertainty: { type: "number", minimum: 0 },
          referenceUncertainty: { type: "number", minimum: 0 },
          suppliedCorrelation: { type: "number", minimum: -1, maximum: 1 },
          useCorrelation: { type: "boolean" },
        },
        required: [
          "resultUncertainty",
          "referenceUncertainty",
          "suppliedCorrelation",
          "useCorrelation",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { differenceUncertainty: { type: "number" } },
        required: ["differenceUncertainty"],
      },
      ports: {
        inputs: [
          {
            id: "resultUncertainty",
            label: "Result Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "referenceUncertainty",
            label: "Reference Uncertainty",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedCorrelation",
            label: "Supplied Correlation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "useCorrelation",
            label: "Use Correlation",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "differenceUncertainty",
            label: "Difference Uncertainty",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = qcReferenceUncertaintyCorrelationFlagTool.execute;
export default qcReferenceUncertaintyCorrelationFlagTool;
