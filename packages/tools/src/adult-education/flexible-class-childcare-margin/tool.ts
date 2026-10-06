import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly classMinutes: number;
  readonly childcareCoverageMinutes: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    classMinutes: { type: "number" },
    childcareCoverageMinutes: { type: "number" },
  },
  required: ["classMinutes", "childcareCoverageMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract supplied class duration from childcare coverage duration in consistent minutes without inferring care availability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { classMinutes, childcareCoverageMinutes } = request;
  const compute = (): Output => {
    return { signedGap: childcareCoverageMinutes - classMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { classMinutes: 12, childcareCoverageMinutes: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const flexibleClassChildcareMarginTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["adult-education", "adult education", "education"],
      keywords: ["adult education", "education"],
    },
    id: "adult-education/flexible-class-childcare-margin",
    title: "Flexible Class Childcare Margin",
    description:
      "Subtract supplied class duration from childcare coverage duration in consistent minutes without inferring care availability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        classMinutes: { type: "number" },
        childcareCoverageMinutes: { type: "number" },
      },
      required: ["classMinutes", "childcareCoverageMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "classMinutes",
          label: "Class Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "childcareCoverageMinutes",
          label: "Childcare Coverage Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = flexibleClassChildcareMarginTool.execute;
export default flexibleClassChildcareMarginTool;
