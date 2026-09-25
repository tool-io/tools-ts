import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceYear: number;
  readonly adaptationYear: number;
};
export type Output = {
  readonly gapYears: number;
  readonly precedesSource: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceYear: { type: "integer" },
    adaptationYear: { type: "integer" },
  },
  required: ["sourceYear", "adaptationYear"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gapYears: { type: "integer" },
    precedesSource: { type: "boolean" },
  },
  required: ["gapYears", "precedesSource"],
} as const;
/** Compare supplied year indices without inferring edition dependence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceYear, adaptationYear } = request;
  const compute = (): Output => {
    return {
      gapYears: adaptationYear - sourceYear,
      precedesSource: adaptationYear < sourceYear,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceYear: 1900, adaptationYear: 1925 },
  output: { gapYears: 25, precedesSource: false },
} satisfies ToolExample<Input, Output>;
export const editionAdaptationTimegapSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-studies/edition-adaptation-timegap-sign",
    title: "Edition Adaptation Timegap Sign Tool",
    description:
      "Compare supplied year indices without inferring edition dependence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceYear: { type: "integer" },
        adaptationYear: { type: "integer" },
      },
      required: ["sourceYear", "adaptationYear"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gapYears: { type: "integer" },
        precedesSource: { type: "boolean" },
      },
      required: ["gapYears", "precedesSource"],
    },
    ports: {
      inputs: [
        {
          id: "sourceYear",
          label: "Source Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "adaptationYear",
          label: "Adaptation Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "gapYears", label: "Gap Years", valueType: { type: "integer" } },
        {
          id: "precedesSource",
          label: "Precedes Source",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = editionAdaptationTimegapSignTool.execute;
export default editionAdaptationTimegapSignTool;
