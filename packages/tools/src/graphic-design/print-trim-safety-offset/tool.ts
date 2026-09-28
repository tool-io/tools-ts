import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contentDistanceFromTrim: number;
  readonly suppliedMinimum: number;
};
export type Output = { readonly remainingMargin: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contentDistanceFromTrim: { type: "number" },
    suppliedMinimum: { type: "number", minimum: 0 },
  },
  required: ["contentDistanceFromTrim", "suppliedMinimum"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingMargin: { type: "number" } },
  required: ["remainingMargin"],
} as const;
/** Compare a supplied content-to-trim distance with an explicit print requirement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contentDistanceFromTrim, suppliedMinimum } = request;
  const compute = (): Output => {
    H.domain(suppliedMinimum >= 0);
    return { remainingMargin: contentDistanceFromTrim - suppliedMinimum };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contentDistanceFromTrim: 5, suppliedMinimum: 3 },
  output: { remainingMargin: 2 },
} satisfies ToolExample<Input, Output>;
export const printTrimSafetyOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "graphic-design/print-trim-safety-offset",
    title: "Print Trim Safety Offset Tool",
    description:
      "Compare a supplied content-to-trim distance with an explicit print requirement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contentDistanceFromTrim: { type: "number" },
        suppliedMinimum: { type: "number", minimum: 0 },
      },
      required: ["contentDistanceFromTrim", "suppliedMinimum"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingMargin: { type: "number" } },
      required: ["remainingMargin"],
    },
    ports: {
      inputs: [
        {
          id: "contentDistanceFromTrim",
          label: "Content Distance From Trim",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedMinimum",
          label: "Supplied Minimum",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "remainingMargin",
          label: "Remaining Margin",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = printTrimSafetyOffsetTool.execute;
export default printTrimSafetyOffsetTool;
