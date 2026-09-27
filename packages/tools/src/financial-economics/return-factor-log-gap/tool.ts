import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstGrossFactor: number;
  readonly secondGrossFactor: number;
};
export type Output = { readonly logGap: number; readonly factorRatio: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstGrossFactor: { type: "number", exclusiveMinimum: 0 },
    secondGrossFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstGrossFactor", "secondGrossFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { logGap: { type: "number" }, factorRatio: { type: "number" } },
  required: ["logGap", "factorRatio"],
} as const;
/** Compare two supplied positive gross return factors in log space. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstGrossFactor, secondGrossFactor } = request;
  const compute = (): Output => {
    H.positive(firstGrossFactor);
    H.positive(secondGrossFactor);
    return {
      logGap: Math.log(firstGrossFactor) - Math.log(secondGrossFactor),
      factorRatio: firstGrossFactor / secondGrossFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstGrossFactor: 1.2, secondGrossFactor: 1 },
  output: { logGap: 0.1823215567939546, factorRatio: 1.2 },
} satisfies ToolExample<Input, Output>;
export const returnFactorLogGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "financial-economics/return-factor-log-gap",
    title: "Return Factor Log Gap Tool",
    description:
      "Compare two supplied positive gross return factors in log space.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstGrossFactor: { type: "number", exclusiveMinimum: 0 },
        secondGrossFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstGrossFactor", "secondGrossFactor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        logGap: { type: "number" },
        factorRatio: { type: "number" },
      },
      required: ["logGap", "factorRatio"],
    },
    ports: {
      inputs: [
        {
          id: "firstGrossFactor",
          label: "First Gross Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondGrossFactor",
          label: "Second Gross Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "logGap", label: "Log Gap", valueType: { type: "number" } },
        {
          id: "factorRatio",
          label: "Factor Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = returnFactorLogGapTool.execute;
export default returnFactorLogGapTool;
