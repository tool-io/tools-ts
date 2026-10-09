import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly suppliedSymptomText: string;
  readonly reporterSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedSymptomText: { type: "string", maxLength: 8192, minLength: 1 },
    reporterSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["entryId", "suppliedSymptomText", "reporterSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit gastrointestinal diary wording and reporter source without diagnosis or severity inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryId, suppliedSymptomText, reporterSource } = request;
  const compute = (): Output => {
    H.domain(entryId.length > 0, "entryId");
    H.domain(suppliedSymptomText.length > 0, "suppliedSymptomText");
    H.domain(reporterSource.length > 0, "reporterSource");
    return {
      token: JSON.stringify([entryId, suppliedSymptomText, reporterSource]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    entryId: "E17",
    suppliedSymptomText: "reported discomfort",
    reporterSource: "self",
  },
  output: { token: '["E17","reported discomfort","self"]' },
} satisfies ToolExample<Input, Output>;
export const gastrointestinalSymptomEntrySourceTagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gastroenterology/gastrointestinal-symptom-entry-source-tag",
      title: "Gastrointestinal Symptom Entry Source Tag Tool",
      description:
        "Record explicit gastrointestinal diary wording and reporter source without diagnosis or severity inference.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          entryId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedSymptomText: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
          reporterSource: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["entryId", "suppliedSymptomText", "reporterSource"],
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
            id: "entryId",
            label: "Entry Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedSymptomText",
            label: "Supplied Symptom Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "reporterSource",
            label: "Reporter Source",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = gastrointestinalSymptomEntrySourceTagTool.execute;
export default gastrointestinalSymptomEntrySourceTagTool;
