import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstEntries: number;
  readonly reentries: number;
  readonly conversions: number;
  readonly countReentries: boolean;
};
export type Output = {
  readonly denominator: number;
  readonly conversionShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEntries: { type: "integer", minimum: 1 },
    reentries: { type: "integer", minimum: 0 },
    conversions: { type: "integer", minimum: 0 },
    countReentries: { type: "boolean" },
  },
  required: ["firstEntries", "reentries", "conversions", "countReentries"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominator: { type: "integer" },
    conversionShare: { type: "number" },
  },
  required: ["denominator", "conversionShare"],
} as const;
/** Choose episode-entry versus first-entry denominator explicitly; conversions are independently supplied counts. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstEntries, reentries, conversions, countReentries } = request;
  const compute = (): Output => {
    H.integer(firstEntries, 1);
    H.integer(reentries, 0);
    H.integer(conversions, 0);
    return {
      denominator: firstEntries + (countReentries ? reentries : 0),
      conversionShare:
        conversions / (firstEntries + (countReentries ? reentries : 0)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstEntries: 100,
    reentries: 20,
    conversions: 30,
    countReentries: false,
  },
  output: { denominator: 100, conversionShare: 0.3 },
} satisfies ToolExample<Input, Output>;
export const leadStageReentryDenominatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "marketing/lead-stage-reentry-denominator",
    title: "Lead Stage Reentry Denominator Tool",
    description:
      "Choose episode-entry versus first-entry denominator explicitly; conversions are independently supplied counts.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEntries: { type: "integer", minimum: 1 },
        reentries: { type: "integer", minimum: 0 },
        conversions: { type: "integer", minimum: 0 },
        countReentries: { type: "boolean" },
      },
      required: ["firstEntries", "reentries", "conversions", "countReentries"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominator: { type: "integer" },
        conversionShare: { type: "number" },
      },
      required: ["denominator", "conversionShare"],
    },
    ports: {
      inputs: [
        {
          id: "firstEntries",
          label: "First Entries",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reentries",
          label: "Reentries",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "conversions",
          label: "Conversions",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "countReentries",
          label: "Count Reentries",
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
          id: "conversionShare",
          label: "Conversion Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = leadStageReentryDenominatorTool.execute;
export default leadStageReentryDenominatorTool;
