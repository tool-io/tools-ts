import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nameRecordId: string;
  readonly resolutionStatus: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nameRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    resolutionStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["resolved", "unresolved", "ambiguous", "not-reviewed"],
    },
  },
  required: ["nameRecordId", "resolutionStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly supplied taxonomic name resolution status without resolving names. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nameRecordId, resolutionStatus } = request;
  const compute = (): Output => {
    H.domain(nameRecordId.length > 0, "nameRecordId");
    H.domain(
      ["resolved", "unresolved", "ambiguous", "not-reviewed"].includes(
        resolutionStatus,
      ),
      "resolutionStatus",
    );
    return { label: nameRecordId + " [" + resolutionStatus + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nameRecordId: "N17", resolutionStatus: "unresolved" },
  output: { label: "N17 [unresolved]" },
} satisfies ToolExample<Input, Output>;
export const speciesListUnresolvedNameStatusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/species-list-unresolved-name-status",
    title: "Species List Unresolved Name Status",
    description:
      "Label an explicitly supplied taxonomic name resolution status without resolving names.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nameRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        resolutionStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["resolved", "unresolved", "ambiguous", "not-reviewed"],
        },
      },
      required: ["nameRecordId", "resolutionStatus"],
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
          id: "nameRecordId",
          label: "Name Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "resolutionStatus",
          label: "Resolution Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = speciesListUnresolvedNameStatusTool.execute;
export default speciesListUnresolvedNameStatusTool;
