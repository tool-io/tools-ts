import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly birthRecordId: string;
  readonly oneBasedOrder: number;
  readonly recordedTotal: number;
};
export type Output = {
  readonly label: string;
  readonly validWithinRecordedTotal: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    birthRecordId: { type: "string", maxLength: 8192, minLength: 1 },
    oneBasedOrder: { type: "integer", minimum: 1 },
    recordedTotal: { type: "integer", minimum: 1 },
  },
  required: ["birthRecordId", "oneBasedOrder", "recordedTotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    validWithinRecordedTotal: { type: "boolean" },
  },
  required: ["label", "validWithinRecordedTotal"],
} as const;
/** Label a supplied multiple-birth order and compare it with the recorded total without inferring identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { birthRecordId, oneBasedOrder, recordedTotal } = request;
  const compute = (): Output => {
    H.domain(birthRecordId.length > 0, "birthRecordId");
    (H.domain(
      Number.isSafeInteger(oneBasedOrder) &&
        oneBasedOrder >= 1 &&
        oneBasedOrder <= Number.MAX_SAFE_INTEGER,
      "oneBasedOrder",
    ),
      oneBasedOrder);
    (H.domain(
      Number.isSafeInteger(recordedTotal) &&
        recordedTotal >= 1 &&
        recordedTotal <= Number.MAX_SAFE_INTEGER,
      "recordedTotal",
    ),
      recordedTotal);
    return {
      label:
        birthRecordId +
        "; birth order " +
        oneBasedOrder +
        " of " +
        recordedTotal,
      validWithinRecordedTotal: oneBasedOrder <= recordedTotal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { birthRecordId: "B17", oneBasedOrder: 2, recordedTotal: 3 },
  output: { label: "B17; birth order 2 of 3", validWithinRecordedTotal: true },
} satisfies ToolExample<Input, Output>;
export const birthRecordMultipleBirthOrderTool = H.defineSchemaCalculation<
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
    id: "obstetrics/birth-record-multiple-birth-order",
    title: "Birth Record Multiple Birth Order",
    description:
      "Label a supplied multiple-birth order and compare it with the recorded total without inferring identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        birthRecordId: { type: "string", maxLength: 8192, minLength: 1 },
        oneBasedOrder: { type: "integer", minimum: 1 },
        recordedTotal: { type: "integer", minimum: 1 },
      },
      required: ["birthRecordId", "oneBasedOrder", "recordedTotal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        validWithinRecordedTotal: { type: "boolean" },
      },
      required: ["label", "validWithinRecordedTotal"],
    },
    ports: {
      inputs: [
        {
          id: "birthRecordId",
          label: "Birth Record Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "oneBasedOrder",
          label: "One Based Order",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedTotal",
          label: "Recorded Total",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "label", label: "Label", valueType: { type: "string" } },
        {
          id: "validWithinRecordedTotal",
          label: "Valid Within Recorded Total",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = birthRecordMultipleBirthOrderTool.execute;
export default birthRecordMultipleBirthOrderTool;
