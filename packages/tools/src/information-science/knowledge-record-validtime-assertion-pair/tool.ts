import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordId: string;
  readonly assertionTimeText: string;
  readonly validStartText: string;
  readonly validEndText: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordId: { type: "string", maxLength: 8192, minLength: 1 },
    assertionTimeText: { type: "string", maxLength: 8192, minLength: 1 },
    validStartText: { type: "string", maxLength: 8192, minLength: 1 },
    validEndText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["recordId", "assertionTimeText", "validStartText", "validEndText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit knowledge-record assertion time and valid-time bounds without conflating transaction and valid time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordId, assertionTimeText, validStartText, validEndText } = request;
  const compute = (): Output => {
    H.domain(recordId.length > 0, "recordId");
    H.domain(assertionTimeText.length > 0, "assertionTimeText");
    H.domain(validStartText.length > 0, "validStartText");
    H.domain(validEndText.length > 0, "validEndText");
    return {
      token: JSON.stringify([
        recordId,
        assertionTimeText,
        validStartText,
        validEndText,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordId: "R17",
    assertionTimeText: "2026-11-01",
    validStartText: "2025-01-01",
    validEndText: "2025-12-31",
  },
  output: { token: '["R17","2026-11-01","2025-01-01","2025-12-31"]' },
} satisfies ToolExample<Input, Output>;
export const knowledgeRecordValidtimeAssertionPairTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information-science/knowledge-record-validtime-assertion-pair",
      title: "Knowledge Record Validtime Assertion Pair Tool",
      description:
        "Preserve explicit knowledge-record assertion time and valid-time bounds without conflating transaction and valid time.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordId: { type: "string", maxLength: 8192, minLength: 1 },
          assertionTimeText: { type: "string", maxLength: 8192, minLength: 1 },
          validStartText: { type: "string", maxLength: 8192, minLength: 1 },
          validEndText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: [
          "recordId",
          "assertionTimeText",
          "validStartText",
          "validEndText",
        ],
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
            id: "recordId",
            label: "Record Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "assertionTimeText",
            label: "Assertion Time Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "validStartText",
            label: "Valid Start Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "validEndText",
            label: "Valid End Text",
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
export const run = knowledgeRecordValidtimeAssertionPairTool.execute;
export default knowledgeRecordValidtimeAssertionPairTool;
