import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly repository: string;
  readonly recordGroup: number;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    repository: { type: "string", maxLength: 8192 },
    recordGroup: { type: "integer", minimum: 1 },
  },
  required: ["repository", "recordGroup"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Namespace an explicitly numbered archival record group without mapping it to an agency. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { repository, recordGroup } = request;
  const compute = (): Output => {
    H.domain(repository.length > 0, "repository");
    (H.domain(
      Number.isSafeInteger(recordGroup) &&
        recordGroup >= 1 &&
        recordGroup <= Number.MAX_SAFE_INTEGER,
      "recordGroup",
    ),
      recordGroup);
    return { token: repository + " RG " + recordGroup };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { repository: "Repository A", recordGroup: 17 },
  output: { token: "Repository A RG 17" },
} satisfies ToolExample<Input, Output>;
export const americanArchiveRecordGroupNumberTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "american-studies/american-archive-record-group-number-token",
      title: "American Archive Record Group Number Token Tool",
      description:
        "Namespace an explicitly numbered archival record group without mapping it to an agency.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          repository: { type: "string", maxLength: 8192 },
          recordGroup: { type: "integer", minimum: 1 },
        },
        required: ["repository", "recordGroup"],
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
            id: "repository",
            label: "Repository",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "recordGroup",
            label: "Record Group",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = americanArchiveRecordGroupNumberTokenTool.execute;
export default americanArchiveRecordGroupNumberTokenTool;
