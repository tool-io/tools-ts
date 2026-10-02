import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly originalTeeth: number;
  readonly preExcluded: number;
  readonly lost: number;
  readonly includeExcluded: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly fraction: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    originalTeeth: { type: "integer", minimum: 0 },
    preExcluded: { type: "integer", minimum: 0 },
    lost: { type: "integer", minimum: 0 },
    includeExcluded: { type: "boolean" },
  },
  required: ["originalTeeth", "preExcluded", "lost", "includeExcluded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    fraction: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["denominator", "fraction", "defined"],
} as const;
/** Research denominator bookkeeping with disjoint supplied exclusions and losses. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { originalTeeth, preExcluded, lost, includeExcluded } = request;
  const compute = (): Output => {
    H.integer(originalTeeth, 0);
    H.integer(preExcluded, 0, originalTeeth);
    H.integer(lost, 0, originalTeeth - preExcluded);
    return {
      denominator: originalTeeth - (includeExcluded ? 0 : preExcluded),
      fraction:
        originalTeeth - (includeExcluded ? 0 : preExcluded) > 0
          ? lost / (originalTeeth - (includeExcluded ? 0 : preExcluded))
          : 0,
      defined: originalTeeth - (includeExcluded ? 0 : preExcluded) > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { originalTeeth: 30, preExcluded: 5, lost: 5, includeExcluded: false },
  output: { denominator: 25, fraction: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const toothLossStudyBaseFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/tooth-loss-study-base-flag",
    title: "Tooth Loss Study Base Flag Tool",
    description:
      "Research denominator bookkeeping with disjoint supplied exclusions and losses.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        originalTeeth: { type: "integer", minimum: 0 },
        preExcluded: { type: "integer", minimum: 0 },
        lost: { type: "integer", minimum: 0 },
        includeExcluded: { type: "boolean" },
      },
      required: ["originalTeeth", "preExcluded", "lost", "includeExcluded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        fraction: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["denominator", "fraction", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "originalTeeth",
          label: "Original Teeth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "preExcluded",
          label: "Pre Excluded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "lost",
          label: "Lost",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "includeExcluded",
          label: "Include Excluded",
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
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = toothLossStudyBaseFlagTool.execute;
export default toothLossStudyBaseFlagTool;
