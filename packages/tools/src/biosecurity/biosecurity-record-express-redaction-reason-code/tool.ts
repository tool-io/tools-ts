import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reason: string;
  readonly allowedReasons: readonly string[];
  readonly actor: string;
  readonly recordId: string;
};
export type Output = {
  readonly recognized: boolean;
  readonly attributed: boolean;
  readonly key: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reason: { type: "string", maxLength: 8192 },
    allowedReasons: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    actor: { type: "string", maxLength: 8192 },
    recordId: { type: "string", maxLength: 8192 },
  },
  required: ["reason", "allowedReasons", "actor", "recordId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recognized: { type: "boolean" },
    attributed: { type: "boolean" },
    key: { type: "string", maxLength: 8192 },
  },
  required: ["recognized", "attributed", "key"],
} as const;
/** Retain an explicit redaction reason and attribution for a benign authorized record. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reason, allowedReasons, actor, recordId } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0);
    return {
      recognized: allowedReasons.includes(reason),
      attributed: actor.length > 0,
      key: JSON.stringify([recordId, reason, actor]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reason: "personal-data",
    allowedReasons: ["personal-data", "confidential"],
    actor: "A",
    recordId: "R1",
  },
  output: {
    recognized: true,
    attributed: true,
    key: '["R1","personal-data","A"]',
  },
} satisfies ToolExample<Input, Output>;
export const biosecurityRecordExpressRedactionReasonCodeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-record-express-redaction-reason-code",
      title: "Biosecurity Record Express Redaction Reason Code Tool",
      description:
        "Retain an explicit redaction reason and attribution for a benign authorized record.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reason: { type: "string", maxLength: 8192 },
          allowedReasons: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          actor: { type: "string", maxLength: 8192 },
          recordId: { type: "string", maxLength: 8192 },
        },
        required: ["reason", "allowedReasons", "actor", "recordId"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recognized: { type: "boolean" },
          attributed: { type: "boolean" },
          key: { type: "string", maxLength: 8192 },
        },
        required: ["recognized", "attributed", "key"],
      },
      ports: {
        inputs: [
          {
            id: "reason",
            label: "Reason",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "allowedReasons",
            label: "Allowed Reasons",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "actor",
            label: "Actor",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "recognized",
            label: "Recognized",
            valueType: { type: "boolean" },
          },
          {
            id: "attributed",
            label: "Attributed",
            valueType: { type: "boolean" },
          },
          { id: "key", label: "Key", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityRecordExpressRedactionReasonCodeTool.execute;
export default biosecurityRecordExpressRedactionReasonCodeTool;
