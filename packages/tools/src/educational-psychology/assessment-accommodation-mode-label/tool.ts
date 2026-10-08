import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly assessmentCode: string;
  readonly accommodation: string;
  readonly recorded: boolean;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    assessmentCode: { type: "string", maxLength: 8192, minLength: 1 },
    accommodation: { type: "string", maxLength: 8192, minLength: 1 },
    recorded: { type: "boolean" },
  },
  required: ["assessmentCode", "accommodation", "recorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label explicitly recorded assessment accommodation metadata without deciding eligibility or score comparability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { assessmentCode, accommodation, recorded } = request;
  const compute = (): Output => {
    H.domain(
      assessmentCode.length > 0 && accommodation.length > 0,
      "assessmentCode",
    );
    return {
      label:
        assessmentCode +
        "; accommodation=" +
        accommodation +
        "; " +
        (recorded ? "recorded" : "not recorded"),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    assessmentCode: "A17",
    accommodation: "large print",
    recorded: true,
  },
  output: { label: "A17; accommodation=large print; recorded" },
} satisfies ToolExample<Input, Output>;
export const assessmentAccommodationModeLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "educational-psychology",
        "educational psychology",
        "psychology",
      ],
      keywords: ["educational psychology", "psychology"],
    },
    id: "educational-psychology/assessment-accommodation-mode-label",
    title: "Assessment Accommodation Mode Label",
    description:
      "Label explicitly recorded assessment accommodation metadata without deciding eligibility or score comparability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        assessmentCode: { type: "string", maxLength: 8192, minLength: 1 },
        accommodation: { type: "string", maxLength: 8192, minLength: 1 },
        recorded: { type: "boolean" },
      },
      required: ["assessmentCode", "accommodation", "recorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { label: { type: "string", maxLength: 8192 } },
      required: ["label"],
    },
    ports: {
      inputs: [
        {
          id: "assessmentCode",
          label: "Assessment Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "accommodation",
          label: "Accommodation",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recorded",
          label: "Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = assessmentAccommodationModeLabelTool.execute;
export default assessmentAccommodationModeLabelTool;
