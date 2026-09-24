import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: readonly number[];
  readonly expectedStart: number;
};
export type Output = {
  readonly missing: readonly number[];
  readonly duplicates: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "array", maxItems: 256, items: { type: "integer" } },
    expectedStart: { type: "integer", minimum: 0 },
  },
  required: ["observed", "expectedStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missing: { type: "array", maxItems: 256, items: { type: "integer" } },
    duplicates: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["missing", "duplicates"],
} as const;
/** Audit a bounded supplied public case-suffix sequence without accessing case records. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, expectedStart } = request;
  const compute = (): Output => {
    H.integer(expectedStart, 0);
    H.domain(observed.length > 0 && observed.every((x) => x >= expectedStart));
    const max = Math.max(...observed);
    H.domain(max - expectedStart <= 255);
    const unique = new Set(observed);
    return {
      missing: Array.from(
        { length: max - expectedStart + 1 },
        (_, i) => expectedStart + i,
      ).filter((x) => !unique.has(x)),
      duplicates: [
        ...new Set(observed.filter((x, i) => observed.indexOf(x) !== i)),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: [1, 2, 4, 4], expectedStart: 1 },
  output: { missing: [3], duplicates: [4] },
} satisfies ToolExample<Input, Output>;
export const publicCaseSuffixSequenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "criminal-justice/public-case-suffix-sequence-gap",
    title: "Public Case Suffix Sequence Gap Tool",
    description:
      "Audit a bounded supplied public case-suffix sequence without accessing case records.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "array", maxItems: 256, items: { type: "integer" } },
        expectedStart: { type: "integer", minimum: 0 },
      },
      required: ["observed", "expectedStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missing: { type: "array", maxItems: 256, items: { type: "integer" } },
        duplicates: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["missing", "duplicates"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "expectedStart",
          label: "Expected Start",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "missing",
          label: "Missing",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "duplicates",
          label: "Duplicates",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = publicCaseSuffixSequenceGapTool.execute;
export default publicCaseSuffixSequenceGapTool;
