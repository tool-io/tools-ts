import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPosition: number;
  readonly secondPosition: number;
  readonly expectedGap: number;
  readonly allowedSlop: number;
};
export type Output = {
  readonly observedGap: number;
  readonly displacement: number;
  readonly matches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPosition: { type: "integer", minimum: 0 },
    secondPosition: { type: "integer", minimum: 0 },
    expectedGap: { type: "integer", minimum: 0 },
    allowedSlop: { type: "integer", minimum: 0 },
  },
  required: ["firstPosition", "secondPosition", "expectedGap", "allowedSlop"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedGap: { type: "integer" },
    displacement: { type: "integer" },
    matches: { type: "boolean" },
  },
  required: ["observedGap", "displacement", "matches"],
} as const;
/** One ordered-position gap displacement against an explicit phrase policy, not a complete search-engine phrase-slop implementation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPosition, secondPosition, expectedGap, allowedSlop } = request;
  const compute = (): Output => {
    H.integer(firstPosition, 0);
    H.integer(secondPosition, 0);
    H.integer(expectedGap, 0);
    H.integer(allowedSlop, 0);
    return {
      observedGap: secondPosition - firstPosition,
      displacement: Math.abs(secondPosition - firstPosition - expectedGap),
      matches:
        Math.abs(secondPosition - firstPosition - expectedGap) <= allowedSlop,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPosition: 5,
    secondPosition: 8,
    expectedGap: 1,
    allowedSlop: 2,
  },
  output: { observedGap: 3, displacement: 2, matches: true },
} satisfies ToolExample<Input, Output>;
export const queryPhraseSlopOneGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "information-science/query-phrase-slop-one-gap",
    title: "Query Phrase Slop One Gap Tool",
    description:
      "One ordered-position gap displacement against an explicit phrase policy, not a complete search-engine phrase-slop implementation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPosition: { type: "integer", minimum: 0 },
        secondPosition: { type: "integer", minimum: 0 },
        expectedGap: { type: "integer", minimum: 0 },
        allowedSlop: { type: "integer", minimum: 0 },
      },
      required: [
        "firstPosition",
        "secondPosition",
        "expectedGap",
        "allowedSlop",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedGap: { type: "integer" },
        displacement: { type: "integer" },
        matches: { type: "boolean" },
      },
      required: ["observedGap", "displacement", "matches"],
    },
    ports: {
      inputs: [
        {
          id: "firstPosition",
          label: "First Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondPosition",
          label: "Second Position",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expectedGap",
          label: "Expected Gap",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "allowedSlop",
          label: "Allowed Slop",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "observedGap",
          label: "Observed Gap",
          valueType: { type: "integer" },
        },
        {
          id: "displacement",
          label: "Displacement",
          valueType: { type: "integer" },
        },
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = queryPhraseSlopOneGapTool.execute;
export default queryPhraseSlopOneGapTool;
