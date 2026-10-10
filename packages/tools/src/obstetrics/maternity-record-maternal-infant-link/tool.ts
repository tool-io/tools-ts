import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly maternalRecordId: string;
  readonly infantRecordId: string;
  readonly assigningSource: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maternalRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    infantRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    assigningSource: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["maternalRecordId", "infantRecordId", "assigningSource"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record an explicitly asserted maternal/infant record link without identity resolution or relationship verification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { maternalRecordId, infantRecordId, assigningSource } = request;
  const compute = (): Output => {
    H.domain(maternalRecordId.length > 0, "maternalRecordId");
    H.domain(infantRecordId.length > 0, "infantRecordId");
    H.domain(assigningSource.length > 0, "assigningSource");
    return {
      token: JSON.stringify([
        maternalRecordId,
        infantRecordId,
        assigningSource,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    maternalRecordId: "M17",
    infantRecordId: "I17",
    assigningSource: "System A",
  },
  output: { token: '["M17","I17","System A"]' },
} satisfies ToolExample<Input, Output>;
export const maternityRecordMaternalInfantLinkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["obstetrics", "health and medicine"],
      keywords: ["obstetrics", "health and medicine"],
    },
    id: "obstetrics/maternity-record-maternal-infant-link",
    title: "Maternity Record Maternal Infant Link",
    description:
      "Record an explicitly asserted maternal/infant record link without identity resolution or relationship verification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        maternalRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        infantRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        assigningSource: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["maternalRecordId", "infantRecordId", "assigningSource"],
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
          id: "maternalRecordId",
          label: "Maternal Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "infantRecordId",
          label: "Infant Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "assigningSource",
          label: "Assigning Source",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = maternityRecordMaternalInfantLinkTool.execute;
export default maternityRecordMaternalInfantLinkTool;
