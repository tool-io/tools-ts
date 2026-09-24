import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studyEnd: number;
  readonly publicationAt: number;
};
export type Output = { readonly lag: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studyEnd: { type: "number" },
    publicationAt: { type: "number" },
  },
  required: ["studyEnd", "publicationAt"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lag: { type: "number" } },
  required: ["lag"],
} as const;
/** Audit supplied public research publication coordinates without an efficacy claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studyEnd, publicationAt } = request;
  const compute = (): Output => {
    return { lag: publicationAt - studyEnd };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { studyEnd: 2020, publicationAt: 2024 },
  output: { lag: 4 },
} satisfies ToolExample<Input, Output>;
export const reviewStudyPublicationLagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/review-study-publication-lag",
    title: "Review Study Publication Lag Tool",
    description:
      "Audit supplied public research publication coordinates without an efficacy claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studyEnd: { type: "number" },
        publicationAt: { type: "number" },
      },
      required: ["studyEnd", "publicationAt"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lag: { type: "number" } },
      required: ["lag"],
    },
    ports: {
      inputs: [
        {
          id: "studyEnd",
          label: "Study End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "publicationAt",
          label: "Publication At",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "lag", label: "Lag", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = reviewStudyPublicationLagTool.execute;
export default reviewStudyPublicationLagTool;
