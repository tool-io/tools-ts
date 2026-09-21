import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEarliest: number;
  readonly firstLatest: number;
  readonly secondEarliest: number;
  readonly secondLatest: number;
};
export type Output = { readonly relation: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEarliest: { type: "integer" },
    firstLatest: { type: "integer" },
    secondEarliest: { type: "integer" },
    secondLatest: { type: "integer" },
  },
  required: ["firstEarliest", "firstLatest", "secondEarliest", "secondLatest"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { relation: { type: "string", maxLength: 8192 } },
  required: ["relation"],
} as const;
/** Partial chronological ordering of supplied inclusive filing-date envelopes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEarliest, firstLatest, secondEarliest, secondLatest } = request;
  const compute = (): Output => {
    H.domain(firstLatest >= firstEarliest && secondLatest >= secondEarliest);
    return {
      relation:
        firstLatest < secondEarliest
          ? "before"
          : secondLatest < firstEarliest
            ? "after"
            : firstEarliest === firstLatest &&
                secondEarliest === secondLatest &&
                firstEarliest === secondEarliest
              ? "same-instant"
              : "unresolved-overlap",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEarliest: 10,
    firstLatest: 12,
    secondEarliest: 15,
    secondLatest: 17,
  },
  output: { relation: "before" },
} satisfies ToolExample<Input, Output>;
export const filingDatePartialOrderTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/filing-date-partial-order-token",
    title: "Filing Date Partial Order Token Tool",
    description:
      "Partial chronological ordering of supplied inclusive filing-date envelopes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEarliest: { type: "integer" },
        firstLatest: { type: "integer" },
        secondEarliest: { type: "integer" },
        secondLatest: { type: "integer" },
      },
      required: [
        "firstEarliest",
        "firstLatest",
        "secondEarliest",
        "secondLatest",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { relation: { type: "string", maxLength: 8192 } },
      required: ["relation"],
    },
    ports: {
      inputs: [
        {
          id: "firstEarliest",
          label: "First Earliest",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstLatest",
          label: "First Latest",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondEarliest",
          label: "Second Earliest",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondLatest",
          label: "Second Latest",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "relation", label: "Relation", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = filingDatePartialOrderTokenTool.execute;
export default filingDatePartialOrderTokenTool;
