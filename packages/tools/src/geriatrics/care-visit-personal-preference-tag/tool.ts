import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly visitId: string;
  readonly preferenceText: string;
  readonly suppliedSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    visitId: { type: "string", maxLength: 8192, minLength: 1 },
    preferenceText: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["visitId", "preferenceText", "suppliedSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit care-visit preference and source without inferring care needs or capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { visitId, preferenceText, suppliedSource } = request;
  const compute = (): Output => {
    H.domain(visitId.length > 0, "visitId");
    H.domain(preferenceText.length > 0, "preferenceText");
    H.domain(suppliedSource.length > 0, "suppliedSource");
    return { token: JSON.stringify([visitId, preferenceText, suppliedSource]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    visitId: "V17",
    preferenceText: "morning visit",
    suppliedSource: "self report",
  },
  output: { token: '["V17","morning visit","self report"]' },
} satisfies ToolExample<Input, Output>;
export const careVisitPersonalPreferenceTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geriatrics/care-visit-personal-preference-tag",
    title: "Care Visit Personal Preference Tag Tool",
    description:
      "Preserve an explicit care-visit preference and source without inferring care needs or capacity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        visitId: { type: "string", maxLength: 8192, minLength: 1 },
        preferenceText: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["visitId", "preferenceText", "suppliedSource"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "visitId",
          label: "Visit Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "preferenceText",
          label: "Preference Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedSource",
          label: "Supplied Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = careVisitPersonalPreferenceTagTool.execute;
export default careVisitPersonalPreferenceTagTool;
