import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedCount: number;
  readonly observedCount: number;
};
export type Output = {
  readonly observedMinusExpected: number;
  readonly shortfall: number;
  readonly excess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedCount: { type: "integer", minimum: 0 },
    observedCount: { type: "integer", minimum: 0 },
  },
  required: ["expectedCount", "observedCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedMinusExpected: { type: "integer" },
    shortfall: { type: "integer" },
    excess: { type: "integer" },
  },
  required: ["observedMinusExpected", "shortfall", "excess"],
} as const;
/** Compare explicit oral-surgery tray item counts without determining tray completeness or procedural safety. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedCount, observedCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(expectedCount) &&
        expectedCount >= 0 &&
        expectedCount <= Number.MAX_SAFE_INTEGER,
      "expectedCount",
    ),
      expectedCount);
    (H.domain(
      Number.isSafeInteger(observedCount) &&
        observedCount >= 0 &&
        observedCount <= Number.MAX_SAFE_INTEGER,
      "observedCount",
    ),
      observedCount);
    return {
      observedMinusExpected: observedCount - expectedCount,
      shortfall: Math.max(0, expectedCount - observedCount),
      excess: Math.max(0, observedCount - expectedCount),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expectedCount: 12, observedCount: 10 },
  output: { observedMinusExpected: -2, shortfall: 2, excess: 0 },
} satisfies ToolExample<Input, Output>;
export const oralSurgeryTrayItemCountDifferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["oral-surgery", "oral surgery", "health and medicine"],
      keywords: ["oral surgery", "health and medicine"],
    },
    id: "oral-surgery/oral-surgery-tray-item-count-difference",
    title: "Oral Surgery Tray Item Count Difference",
    description:
      "Compare explicit oral-surgery tray item counts without determining tray completeness or procedural safety.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedCount: { type: "integer", minimum: 0 },
        observedCount: { type: "integer", minimum: 0 },
      },
      required: ["expectedCount", "observedCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedMinusExpected: { type: "integer" },
        shortfall: { type: "integer" },
        excess: { type: "integer" },
      },
      required: ["observedMinusExpected", "shortfall", "excess"],
    },
    ports: {
      inputs: [
        {
          id: "expectedCount",
          label: "Expected Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observedCount",
          label: "Observed Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "observedMinusExpected",
          label: "Observed Minus Expected",
          valueType: { type: "integer" },
        },
        { id: "shortfall", label: "Shortfall", valueType: { type: "integer" } },
        { id: "excess", label: "Excess", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = oralSurgeryTrayItemCountDifferenceTool.execute;
export default oralSurgeryTrayItemCountDifferenceTool;
