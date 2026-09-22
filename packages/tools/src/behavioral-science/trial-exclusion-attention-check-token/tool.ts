import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: readonly string[];
  readonly expected: readonly string[];
  readonly required: readonly boolean[];
};
export type Output = {
  readonly failedIndexes: readonly number[];
  readonly exclude: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    expected: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    required: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["observed", "expected", "required"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    failedIndexes: { type: "array", maxItems: 256, items: { type: "integer" } },
    exclude: { type: "boolean" },
  },
  required: ["failedIndexes", "exclude"],
} as const;
/** Apply exact caller-supplied attention-check answers and required flags; does not infer participant attention from free text. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, expected, required } = request;
  const compute = (): Output => {
    H.sameLength(observed, expected);
    H.sameLength(observed, required);
    const failedIndexes = observed.flatMap((x, i) =>
      required[i] && x !== expected[i] ? [i] : [],
    );
    return { failedIndexes, exclude: failedIndexes.length > 0 };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: ["A", "B"], expected: ["A", "C"], required: [true, true] },
  output: { failedIndexes: [1], exclude: true },
} satisfies ToolExample<Input, Output>;
export const trialExclusionAttentionCheckTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "behavioral-science/trial-exclusion-attention-check-token",
    title: "Trial Exclusion Attention Check Token Tool",
    description:
      "Apply exact caller-supplied attention-check answers and required flags; does not infer participant attention from free text.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        expected: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        required: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["observed", "expected", "required"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        failedIndexes: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        exclude: { type: "boolean" },
      },
      required: ["failedIndexes", "exclude"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "expected",
          label: "Expected",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "required",
          label: "Required",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "failedIndexes",
          label: "Failed Indexes",
          valueType: { type: "list", items: { type: "integer" } },
        },
        { id: "exclude", label: "Exclude", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = trialExclusionAttentionCheckTokenTool.execute;
export default trialExclusionAttentionCheckTokenTool;
