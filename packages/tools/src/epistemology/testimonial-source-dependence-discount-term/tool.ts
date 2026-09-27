import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly logEvidence: number;
  readonly independenceWeight: number;
  readonly sourceCount: number;
};
export type Output = {
  readonly weightedLogEvidence: number;
  readonly independentEquivalentSources: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    logEvidence: { type: "number" },
    independenceWeight: { type: "number", minimum: 0, maximum: 1 },
    sourceCount: { type: "integer", minimum: 0 },
  },
  required: ["logEvidence", "independenceWeight", "sourceCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weightedLogEvidence: { type: "number" },
    independentEquivalentSources: { type: "number" },
  },
  required: ["weightedLogEvidence", "independentEquivalentSources"],
} as const;
/** Caller-defined power-likelihood discount, not an estimate of source dependence or a general theorem about testimony. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { logEvidence, independenceWeight, sourceCount } = request;
  const compute = (): Output => {
    H.probability(independenceWeight);
    H.integer(sourceCount, 0);
    return {
      weightedLogEvidence: logEvidence * independenceWeight * sourceCount,
      independentEquivalentSources: independenceWeight * sourceCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { logEvidence: 2, independenceWeight: 0.5, sourceCount: 4 },
  output: { weightedLogEvidence: 4, independentEquivalentSources: 2 },
} satisfies ToolExample<Input, Output>;
export const testimonialSourceDependenceDiscountTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epistemology/testimonial-source-dependence-discount-term",
      title: "Testimonial Source Dependence Discount Term Tool",
      description:
        "Caller-defined power-likelihood discount, not an estimate of source dependence or a general theorem about testimony.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          logEvidence: { type: "number" },
          independenceWeight: { type: "number", minimum: 0, maximum: 1 },
          sourceCount: { type: "integer", minimum: 0 },
        },
        required: ["logEvidence", "independenceWeight", "sourceCount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          weightedLogEvidence: { type: "number" },
          independentEquivalentSources: { type: "number" },
        },
        required: ["weightedLogEvidence", "independentEquivalentSources"],
      },
      ports: {
        inputs: [
          {
            id: "logEvidence",
            label: "Log Evidence",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "independenceWeight",
            label: "Independence Weight",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sourceCount",
            label: "Source Count",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "weightedLogEvidence",
            label: "Weighted Log Evidence",
            valueType: { type: "number" },
          },
          {
            id: "independentEquivalentSources",
            label: "Independent Equivalent Sources",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = testimonialSourceDependenceDiscountTermTool.execute;
export default testimonialSourceDependenceDiscountTermTool;
