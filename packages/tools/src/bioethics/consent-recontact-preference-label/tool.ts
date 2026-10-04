import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly preference: string };
export type Output = {
  readonly label: string;
  readonly recontactRecorded: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preference: {
      type: "string",
      maxLength: 8192,
      enum: ["yes", "no", "not-asked", "withdrawn"],
    },
  },
  required: ["preference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    recontactRecorded: { type: "boolean" },
  },
  required: ["label", "recontactRecorded"],
} as const;
/** Render an explicit recontact preference while keeping absence of a response distinct from a recorded yes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preference } = request;
  const compute = (): Output => {
    H.domain(
      ["yes", "no", "not-asked", "withdrawn"].includes(preference),
      "preference",
    );
    return {
      label: "Recontact: " + preference,
      recontactRecorded: preference === "yes",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preference: "yes" },
  output: { label: "Recontact: yes", recontactRecorded: true },
} satisfies ToolExample<Input, Output>;
export const consentRecontactPreferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/consent-recontact-preference-label",
    title: "Consent Recontact Preference Label Tool",
    description:
      "Render an explicit recontact preference while keeping absence of a response distinct from a recorded yes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preference: {
          type: "string",
          maxLength: 8192,
          enum: ["yes", "no", "not-asked", "withdrawn"],
        },
      },
      required: ["preference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        recontactRecorded: { type: "boolean" },
      },
      required: ["label", "recontactRecorded"],
    },
    ports: {
      inputs: [
        {
          id: "preference",
          label: "Preference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "recontactRecorded",
          label: "Recontact Recorded",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = consentRecontactPreferenceLabelTool.execute;
export default consentRecontactPreferenceLabelTool;
