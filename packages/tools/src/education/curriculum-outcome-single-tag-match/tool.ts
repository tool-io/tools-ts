import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTag: string;
  readonly targetTag: string;
  readonly caseSensitive: boolean;
};
export type Output = { readonly matches: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTag: { type: "string", maxLength: 8192, minLength: 1 },
    targetTag: { type: "string", maxLength: 8192, minLength: 1 },
    caseSensitive: { type: "boolean" },
  },
  required: ["recordedTag", "targetTag", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { matches: { type: "boolean" } },
  required: ["matches"],
} as const;
/** Compare explicit curriculum-outcome tag text under an exact or Unicode-default lowercase policy without assessing learning. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTag, targetTag, caseSensitive } = request;
  const compute = (): Output => {
    H.domain(recordedTag.length > 0 && targetTag.length > 0, "recordedTag");
    return {
      matches: caseSensitive
        ? recordedTag === targetTag
        : recordedTag.toLowerCase() === targetTag.toLowerCase(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedTag: "OUT-A", targetTag: "out-a", caseSensitive: false },
  output: { matches: true },
} satisfies ToolExample<Input, Output>;
export const curriculumOutcomeSingleTagMatchTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["education"],
      keywords: ["education"],
    },
    id: "education/curriculum-outcome-single-tag-match",
    title: "Curriculum Outcome Single Tag Match",
    description:
      "Compare explicit curriculum-outcome tag text under an exact or Unicode-default lowercase policy without assessing learning.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedTag: { type: "string", maxLength: 8192, minLength: 1 },
        targetTag: { type: "string", maxLength: 8192, minLength: 1 },
        caseSensitive: { type: "boolean" },
      },
      required: ["recordedTag", "targetTag", "caseSensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { matches: { type: "boolean" } },
      required: ["matches"],
    },
    ports: {
      inputs: [
        {
          id: "recordedTag",
          label: "Recorded Tag",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "targetTag",
          label: "Target Tag",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = curriculumOutcomeSingleTagMatchTool.execute;
export default curriculumOutcomeSingleTagMatchTool;
