import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly entryId: string;
  readonly presenceKnown: boolean;
  readonly symptomPresent: boolean;
};
export type Output = { readonly recordedStatus: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    entryId: { type: "string", maxLength: 8192, minLength: 1 },
    presenceKnown: { type: "boolean" },
    symptomPresent: { type: "boolean" },
  },
  required: ["entryId", "presenceKnown", "symptomPresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { recordedStatus: { type: "string", maxLength: 8192 } },
  required: ["recordedStatus"],
} as const;
/** Distinguish an explicit unknown symptom observation from a known absent observation without diagnosis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { entryId, presenceKnown, symptomPresent } = request;
  const compute = (): Output => {
    H.domain(entryId.length > 0, "entryId");
    H.domain(presenceKnown || !symptomPresent, "symptomPresent");
    return {
      recordedStatus: presenceKnown
        ? symptomPresent
          ? "present"
          : "absent"
        : "unknown",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { entryId: "E17", presenceKnown: false, symptomPresent: false },
  output: { recordedStatus: "unknown" },
} satisfies ToolExample<Input, Output>;
export const symptomDiaryUnknownVersusAbsentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["health", "health and medicine"],
      keywords: ["health", "health and medicine"],
    },
    id: "health/symptom-diary-unknown-versus-absent",
    title: "Symptom Diary Unknown Versus Absent",
    description:
      "Distinguish an explicit unknown symptom observation from a known absent observation without diagnosis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        entryId: { type: "string", maxLength: 8192, minLength: 1 },
        presenceKnown: { type: "boolean" },
        symptomPresent: { type: "boolean" },
      },
      required: ["entryId", "presenceKnown", "symptomPresent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { recordedStatus: { type: "string", maxLength: 8192 } },
      required: ["recordedStatus"],
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
          id: "presenceKnown",
          label: "Presence Known",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "symptomPresent",
          label: "Symptom Present",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "recordedStatus",
          label: "Recorded Status",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = symptomDiaryUnknownVersusAbsentTool.execute;
export default symptomDiaryUnknownVersusAbsentTool;
