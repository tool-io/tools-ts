import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nameUsageId: string;
  readonly recordedStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nameUsageId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["accepted", "synonym", "unresolved", "misapplied", "unspecified"],
    },
  },
  required: ["nameUsageId", "recordedStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly recorded name-usage status without determining accepted taxonomy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nameUsageId, recordedStatus } = request;
  const compute = (): Output => {
    H.domain(nameUsageId.length > 0, "nameUsageId");
    H.domain(
      [
        "accepted",
        "synonym",
        "unresolved",
        "misapplied",
        "unspecified",
      ].includes(recordedStatus),
      "recordedStatus",
    );
    return { label: nameUsageId + " [" + recordedStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nameUsageId: "NU17", recordedStatus: "synonym" },
  output: { label: "NU17 [synonym]" },
} satisfies ToolExample<Input, Output>;
export const nameUsageAcceptedSynonymLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biosystematics", "biology"],
      keywords: ["biosystematics", "biology"],
    },
    id: "biosystematics/name-usage-accepted-synonym-label",
    title: "Name Usage Accepted Synonym Label",
    description:
      "Label an explicitly recorded name-usage status without determining accepted taxonomy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nameUsageId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedStatus: {
          type: "string",
          maxLength: 8192,
          enum: [
            "accepted",
            "synonym",
            "unresolved",
            "misapplied",
            "unspecified",
          ],
        },
      },
      required: ["nameUsageId", "recordedStatus"],
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
          id: "nameUsageId",
          label: "Name Usage Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedStatus",
          label: "Recorded Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = nameUsageAcceptedSynonymLabelTool.execute;
export default nameUsageAcceptedSynonymLabelTool;
