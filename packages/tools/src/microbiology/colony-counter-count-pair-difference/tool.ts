import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCount: number;
  readonly secondCount: number;
};
export type Output = {
  readonly secondMinusFirst: number;
  readonly absoluteDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCount: { type: "integer", minimum: 0 },
    secondCount: { type: "integer", minimum: 0 },
  },
  required: ["firstCount", "secondCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    secondMinusFirst: { type: "integer" },
    absoluteDifference: { type: "integer" },
  },
  required: ["secondMinusFirst", "absoluteDifference"],
} as const;
/** Compare two explicit colony-counter readings without resolving colonies or determining a valid count range. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCount, secondCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(firstCount) &&
        firstCount >= 0 &&
        firstCount <= Number.MAX_SAFE_INTEGER,
      "firstCount",
    ),
      firstCount);
    (H.domain(
      Number.isSafeInteger(secondCount) &&
        secondCount >= 0 &&
        secondCount <= Number.MAX_SAFE_INTEGER,
      "secondCount",
    ),
      secondCount);
    return {
      secondMinusFirst: secondCount - firstCount,
      absoluteDifference: Math.abs(secondCount - firstCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCount: 42, secondCount: 46 },
  output: { secondMinusFirst: 4, absoluteDifference: 4 },
} satisfies ToolExample<Input, Output>;
export const colonyCounterCountPairDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["microbiology", "biology"],
      keywords: ["microbiology", "biology"],
    },
    id: "microbiology/colony-counter-count-pair-difference",
    title: "Colony Counter Count Pair Difference",
    description:
      "Compare two explicit colony-counter readings without resolving colonies or determining a valid count range.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCount: { type: "integer", minimum: 0 },
        secondCount: { type: "integer", minimum: 0 },
      },
      required: ["firstCount", "secondCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        secondMinusFirst: { type: "integer" },
        absoluteDifference: { type: "integer" },
      },
      required: ["secondMinusFirst", "absoluteDifference"],
    },
    ports: {
      inputs: [
        {
          id: "firstCount",
          label: "First Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondCount",
          label: "Second Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "secondMinusFirst",
          label: "Second Minus First",
          valueType: { type: "integer" },
        },
        {
          id: "absoluteDifference",
          label: "Absolute Difference",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = colonyCounterCountPairDifferenceTool.execute;
export default colonyCounterCountPairDifferenceTool;
