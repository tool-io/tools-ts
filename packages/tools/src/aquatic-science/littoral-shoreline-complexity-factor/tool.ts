import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shorelineLength: number;
  readonly lakeArea: number;
};
export type Output = {
  readonly developmentFactor: number;
  readonly circularReferenceLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shorelineLength: { type: "number", minimum: 0 },
    lakeArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["shorelineLength", "lakeArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    developmentFactor: { type: "number" },
    circularReferenceLength: { type: "number" },
  },
  required: ["developmentFactor", "circularReferenceLength"],
} as const;
/** Shoreline development relative to the circumference of an equal-area circle, without changing map resolution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shorelineLength, lakeArea } = request;
  const compute = (): Output => {
    H.domain(shorelineLength >= 0);
    H.positive(lakeArea);
    return {
      developmentFactor: shorelineLength / (2 * Math.sqrt(Math.PI * lakeArea)),
      circularReferenceLength: 2 * Math.sqrt(Math.PI * lakeArea),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { shorelineLength: 12.566370614359172, lakeArea: 12.566370614359172 },
  output: { developmentFactor: 1, circularReferenceLength: 12.566370614359172 },
} satisfies ToolExample<Input, Output>;
export const littoralShorelineComplexityFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquatic-science/littoral-shoreline-complexity-factor",
    title: "Littoral Shoreline Complexity Factor Tool",
    description:
      "Shoreline development relative to the circumference of an equal-area circle, without changing map resolution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shorelineLength: { type: "number", minimum: 0 },
        lakeArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["shorelineLength", "lakeArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        developmentFactor: { type: "number" },
        circularReferenceLength: { type: "number" },
      },
      required: ["developmentFactor", "circularReferenceLength"],
    },
    ports: {
      inputs: [
        {
          id: "shorelineLength",
          label: "Shoreline Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lakeArea",
          label: "Lake Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "developmentFactor",
          label: "Development Factor",
          valueType: { type: "number" },
        },
        {
          id: "circularReferenceLength",
          label: "Circular Reference Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = littoralShorelineComplexityFactorTool.execute;
export default littoralShorelineComplexityFactorTool;
