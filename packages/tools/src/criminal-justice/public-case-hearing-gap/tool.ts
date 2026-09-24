import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstHearing: number;
  readonly secondHearing: number;
};
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstHearing: { type: "number" },
    secondHearing: { type: "number" },
  },
  required: ["firstHearing", "secondHearing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Compare supplied public case-event coordinates without predicting legal outcomes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstHearing, secondHearing } = request;
  const compute = (): Output => {
    return { gap: secondHearing - firstHearing };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstHearing: 10, secondHearing: 25 },
  output: { gap: 15 },
} satisfies ToolExample<Input, Output>;
export const publicCaseHearingGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "criminal-justice/public-case-hearing-gap",
    title: "Public Case Hearing Gap Tool",
    description:
      "Compare supplied public case-event coordinates without predicting legal outcomes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstHearing: { type: "number" },
        secondHearing: { type: "number" },
      },
      required: ["firstHearing", "secondHearing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "firstHearing",
          label: "First Hearing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondHearing",
          label: "Second Hearing",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = publicCaseHearingGapTool.execute;
export default publicCaseHearingGapTool;
