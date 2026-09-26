import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly supporting: number;
  readonly contradicting: number;
  readonly unresolved: number;
  readonly countUnresolved: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly supportingShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supporting: { type: "integer", minimum: 0 },
    contradicting: { type: "integer", minimum: 0 },
    unresolved: { type: "integer", minimum: 0 },
    countUnresolved: { type: "boolean" },
  },
  required: ["supporting", "contradicting", "unresolved", "countUnresolved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    supportingShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "supportingShare", "defined"],
} as const;
/** Summarize already coded evidence counts without assigning evidential independence or hypothesis probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { supporting, contradicting, unresolved, countUnresolved } = request;
  const compute = (): Output => {
    H.integer(supporting, 0);
    H.integer(contradicting, 0);
    H.integer(unresolved, 0);
    return {
      denominator:
        supporting + contradicting + (countUnresolved ? unresolved : 0),
      supportingShare:
        supporting + contradicting + (countUnresolved ? unresolved : 0) > 0
          ? supporting /
            (supporting + contradicting + (countUnresolved ? unresolved : 0))
          : 0,
      defined:
        supporting + contradicting + (countUnresolved ? unresolved : 0) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    supporting: 6,
    contradicting: 2,
    unresolved: 2,
    countUnresolved: true,
  },
  output: { denominator: 10, supportingShare: 0.6, defined: true },
} satisfies ToolExample<Input, Output>;
export const hypothesisEvidenceCountShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/hypothesis-evidence-count-share",
    title: "Hypothesis Evidence Count Share Tool",
    description:
      "Summarize already coded evidence counts without assigning evidential independence or hypothesis probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supporting: { type: "integer", minimum: 0 },
        contradicting: { type: "integer", minimum: 0 },
        unresolved: { type: "integer", minimum: 0 },
        countUnresolved: { type: "boolean" },
      },
      required: [
        "supporting",
        "contradicting",
        "unresolved",
        "countUnresolved",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        supportingShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "supportingShare", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "supporting",
          label: "Supporting",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "contradicting",
          label: "Contradicting",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unresolved",
          label: "Unresolved",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countUnresolved",
          label: "Count Unresolved",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "integer" },
        },
        {
          id: "supportingShare",
          label: "Supporting Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = hypothesisEvidenceCountShareTool.execute;
export default hypothesisEvidenceCountShareTool;
