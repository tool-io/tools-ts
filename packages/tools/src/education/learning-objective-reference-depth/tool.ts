import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reference: string; readonly separator: string };
export type Output = { readonly depth: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    separator: { type: "string", maxLength: 8192 },
  },
  required: ["reference", "separator"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { depth: { type: "integer" } },
  required: ["depth"],
} as const;
/** Count literal nonempty objective-reference components under an explicit separator. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, separator } = request;
  const compute = (): Output => {
    H.domain(
      separator.length > 0 &&
        reference.split(separator).every((x) => x.length > 0),
    );
    return { depth: reference.split(separator).length };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reference: "course.unit.objective", separator: "." },
  output: { depth: 3 },
} satisfies ToolExample<Input, Output>;
export const learningObjectiveReferenceDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/learning-objective-reference-depth",
    title: "Learning Objective Reference Depth Tool",
    description:
      "Count literal nonempty objective-reference components under an explicit separator.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        separator: { type: "string", maxLength: 8192 },
      },
      required: ["reference", "separator"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { depth: { type: "integer" } },
      required: ["depth"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "separator",
          label: "Separator",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "depth", label: "Depth", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = learningObjectiveReferenceDepthTool.execute;
export default learningObjectiveReferenceDepthTool;
