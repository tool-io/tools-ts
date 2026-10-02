import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSide: string;
  readonly secondSide: string;
  readonly firstTooth: string;
  readonly secondTooth: string;
  readonly expectedFirst: string;
  readonly expectedSecond: string;
};
export type Output = {
  readonly sideMatches: boolean;
  readonly toothPairMatches: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSide: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "midline"],
    },
    secondSide: { type: "string", maxLength: 8192 },
    firstTooth: { type: "string", maxLength: 8192 },
    secondTooth: { type: "string", maxLength: 8192 },
    expectedFirst: { type: "string", maxLength: 8192 },
    expectedSecond: { type: "string", maxLength: 8192 },
  },
  required: [
    "firstSide",
    "secondSide",
    "firstTooth",
    "secondTooth",
    "expectedFirst",
    "expectedSecond",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sideMatches: { type: "boolean" },
    toothPairMatches: { type: "boolean" },
  },
  required: ["sideMatches", "toothPairMatches"],
} as const;
/** Compare explicit side and expected tooth-pair metadata. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstSide,
    secondSide,
    firstTooth,
    secondTooth,
    expectedFirst,
    expectedSecond,
  } = request;
  const compute = (): Output => {
    H.domain(
      ["left", "right", "midline"].includes(firstSide) &&
        ["left", "right", "midline"].includes(secondSide),
    );
    return {
      sideMatches: firstSide === secondSide,
      toothPairMatches:
        firstTooth === expectedFirst && secondTooth === expectedSecond,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstSide: "left",
    secondSide: "right",
    firstTooth: "11",
    secondTooth: "21",
    expectedFirst: "11",
    expectedSecond: "21",
  },
  output: { sideMatches: false, toothPairMatches: true },
} satisfies ToolExample<Input, Output>;
export const periodontalSitePairLateralityCheckTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/periodontal-site-pair-laterality-check",
    title: "Periodontal Site Pair Laterality Check Tool",
    description: "Compare explicit side and expected tooth-pair metadata.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstSide: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "midline"],
        },
        secondSide: { type: "string", maxLength: 8192 },
        firstTooth: { type: "string", maxLength: 8192 },
        secondTooth: { type: "string", maxLength: 8192 },
        expectedFirst: { type: "string", maxLength: 8192 },
        expectedSecond: { type: "string", maxLength: 8192 },
      },
      required: [
        "firstSide",
        "secondSide",
        "firstTooth",
        "secondTooth",
        "expectedFirst",
        "expectedSecond",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sideMatches: { type: "boolean" },
        toothPairMatches: { type: "boolean" },
      },
      required: ["sideMatches", "toothPairMatches"],
    },
    ports: {
      inputs: [
        {
          id: "firstSide",
          label: "First Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondSide",
          label: "Second Side",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstTooth",
          label: "First Tooth",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "secondTooth",
          label: "Second Tooth",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedFirst",
          label: "Expected First",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "expectedSecond",
          label: "Expected Second",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "sideMatches",
          label: "Side Matches",
          valueType: { type: "boolean" },
        },
        {
          id: "toothPairMatches",
          label: "Tooth Pair Matches",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = periodontalSitePairLateralityCheckTool.execute;
export default periodontalSitePairLateralityCheckTool;
