import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ballotRecordId: string;
  readonly recordedCode: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ballotRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    recordedCode: {
      type: "string",
      maxLength: 8192,
      enum: ["overvote", "undervote", "valid", "unresolved"],
    },
  },
  required: ["ballotRecordId", "recordedCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label an explicitly adjudicated ballot status without interpreting markings or deciding ballot validity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ballotRecordId, recordedCode } = request;
  const compute = (): Output => {
    H.domain(ballotRecordId.length > 0, "ballotRecordId");
    H.domain(
      ["overvote", "undervote", "valid", "unresolved"].includes(recordedCode),
      "recordedCode",
    );
    return { label: ballotRecordId + " [" + recordedCode + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ballotRecordId: "B17", recordedCode: "undervote" },
  output: { label: "B17 [undervote]" },
} satisfies ToolExample<Input, Output>;
export const ballotOvervoteUndervoteCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["political-science", "political science", "social sciences"],
      keywords: ["political science", "social sciences"],
    },
    id: "political-science/ballot-overvote-undervote-code",
    title: "Ballot Overvote Undervote Code",
    description:
      "Label an explicitly adjudicated ballot status without interpreting markings or deciding ballot validity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ballotRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        recordedCode: {
          type: "string",
          maxLength: 8192,
          enum: ["overvote", "undervote", "valid", "unresolved"],
        },
      },
      required: ["ballotRecordId", "recordedCode"],
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
          id: "ballotRecordId",
          label: "Ballot Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "recordedCode",
          label: "Recorded Code",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ballotOvervoteUndervoteCodeTool.execute;
export default ballotOvervoteUndervoteCodeTool;
