import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly planned: number;
  readonly unobserved: number;
  readonly excluded: number;
  readonly overlap: number;
};
export type Output = {
  readonly denominator: number;
  readonly missingFromBase: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    planned: { type: "integer", minimum: 0 },
    unobserved: { type: "integer", minimum: 0 },
    excluded: { type: "integer", minimum: 0 },
    overlap: { type: "integer", minimum: 0 },
  },
  required: ["planned", "unobserved", "excluded", "overlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    missingFromBase: { type: "integer" },
  },
  required: ["denominator", "missingFromBase"],
} as const;
/** Audit caller-classified research joint-record denominator exclusions without a clinical disease score. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { planned, unobserved, excluded, overlap } = request;
  const compute = (): Output => {
    H.integer(planned, 0);
    H.integer(unobserved, 0, planned);
    H.integer(excluded, 0, planned);
    H.integer(overlap, 0, Math.min(unobserved, excluded));
    H.domain(unobserved + excluded - overlap <= planned);
    return {
      denominator: planned - unobserved - excluded + overlap,
      missingFromBase: unobserved + excluded - overlap,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { planned: 28, unobserved: 3, excluded: 2, overlap: 1 },
  output: { denominator: 24, missingFromBase: 4 },
} satisfies ToolExample<Input, Output>;
export const researchJointCountDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/research-joint-count-denominator",
    title: "Research Joint Count Denominator Tool",
    description:
      "Audit caller-classified research joint-record denominator exclusions without a clinical disease score.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        planned: { type: "integer", minimum: 0 },
        unobserved: { type: "integer", minimum: 0 },
        excluded: { type: "integer", minimum: 0 },
        overlap: { type: "integer", minimum: 0 },
      },
      required: ["planned", "unobserved", "excluded", "overlap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        missingFromBase: { type: "integer" },
      },
      required: ["denominator", "missingFromBase"],
    },
    ports: {
      inputs: [
        {
          id: "planned",
          label: "Planned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unobserved",
          label: "Unobserved",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "excluded",
          label: "Excluded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "missingFromBase",
          label: "Missing From Base",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchJointCountDenominatorTool.execute;
export default researchJointCountDenominatorTool;
