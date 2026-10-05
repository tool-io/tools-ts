import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly missionCode: string;
  readonly sequence: number;
  readonly year: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missionCode: { type: "string", maxLength: 8192 },
    sequence: { type: "integer", minimum: 1 },
    year: { type: "integer", minimum: 1, maximum: 9999 },
  },
  required: ["missionCode", "sequence", "year"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicit mission, sequence and year as a diplomatic-note reference without implying an official universal convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { missionCode, sequence, year } = request;
  const compute = (): Output => {
    H.domain(missionCode.length > 0, "missionCode");
    (H.domain(
      Number.isSafeInteger(sequence) &&
        sequence >= 1 &&
        sequence <= Number.MAX_SAFE_INTEGER,
      "sequence",
    ),
      sequence);
    (H.domain(Number.isSafeInteger(year) && year >= 1 && year <= 9999, "year"),
      year);
    return { label: missionCode + " No. " + sequence + "/" + year };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { missionCode: "MISSION-A", sequence: 17, year: 2026 },
  output: { label: "MISSION-A No. 17/2026" },
} satisfies ToolExample<Input, Output>;
export const diplomaticNoteReferenceLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-relations/diplomatic-note-reference-label",
    title: "Diplomatic Note Reference Label Tool",
    description:
      "Format an explicit mission, sequence and year as a diplomatic-note reference without implying an official universal convention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missionCode: { type: "string", maxLength: 8192 },
        sequence: { type: "integer", minimum: 1 },
        year: { type: "integer", minimum: 1, maximum: 9999 },
      },
      required: ["missionCode", "sequence", "year"],
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
          id: "missionCode",
          label: "Mission Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sequence",
          label: "Sequence",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "year",
          label: "Year",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = diplomaticNoteReferenceLabelTool.execute;
export default diplomaticNoteReferenceLabelTool;
