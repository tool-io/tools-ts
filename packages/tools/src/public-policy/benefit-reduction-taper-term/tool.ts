import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assessableAmount: number;
  readonly disregard: number;
  readonly taper: number;
  readonly maximumReduction: number;
};
export type Output = { readonly reduction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessableAmount: { type: "number", minimum: 0 },
    disregard: { type: "number", minimum: 0 },
    taper: { type: "number", minimum: 0 },
    maximumReduction: { type: "number", minimum: 0 },
  },
  required: ["assessableAmount", "disregard", "taper", "maximumReduction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { reduction: { type: "number" } },
  required: ["reduction"],
} as const;
/** Apply a supplied disregard, taper and reduction cap without selecting a benefit policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assessableAmount, disregard, taper, maximumReduction } = request;
  const compute = (): Output => {
    H.domain(
      assessableAmount >= 0 &&
        disregard >= 0 &&
        taper >= 0 &&
        maximumReduction >= 0,
    );
    return {
      reduction: Math.min(
        maximumReduction,
        Math.max(0, assessableAmount - disregard) * taper,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    assessableAmount: 100,
    disregard: 20,
    taper: 0.5,
    maximumReduction: 30,
  },
  output: { reduction: 30 },
} satisfies ToolExample<Input, Output>;
export const benefitReductionTaperTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "public-policy/benefit-reduction-taper-term",
    title: "Benefit Reduction Taper Term Tool",
    description:
      "Apply a supplied disregard, taper and reduction cap without selecting a benefit policy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assessableAmount: { type: "number", minimum: 0 },
        disregard: { type: "number", minimum: 0 },
        taper: { type: "number", minimum: 0 },
        maximumReduction: { type: "number", minimum: 0 },
      },
      required: ["assessableAmount", "disregard", "taper", "maximumReduction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { reduction: { type: "number" } },
      required: ["reduction"],
    },
    ports: {
      inputs: [
        {
          id: "assessableAmount",
          label: "Assessable Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "disregard",
          label: "Disregard",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taper",
          label: "Taper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "maximumReduction",
          label: "Maximum Reduction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "reduction", label: "Reduction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = benefitReductionTaperTermTool.execute;
export default benefitReductionTaperTermTool;
