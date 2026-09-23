import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly releasedAt: number;
  readonly acceptedAt: number;
  readonly suppliedLimit: number;
  readonly senderOffset: number;
  readonly receiverOffset: number;
};
export type Output = {
  readonly rawLag: number;
  readonly correctedLag: number;
  readonly withinLimit: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    releasedAt: { type: "number" },
    acceptedAt: { type: "number" },
    suppliedLimit: { type: "number", minimum: 0 },
    senderOffset: { type: "number" },
    receiverOffset: { type: "number" },
  },
  required: [
    "releasedAt",
    "acceptedAt",
    "suppliedLimit",
    "senderOffset",
    "receiverOffset",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawLag: { type: "number" },
    correctedLag: { type: "number" },
    withinLimit: { type: "boolean" },
  },
  required: ["rawLag", "correctedLag", "withinLimit"],
} as const;
/** Calculate biosecurity inventory custody handover lag from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    releasedAt,
    acceptedAt,
    suppliedLimit,
    senderOffset,
    receiverOffset,
  } = request;
  const compute = (): Output => {
    H.domain(
      suppliedLimit >= 0 &&
        acceptedAt - receiverOffset >= releasedAt - senderOffset,
    );
    return {
      rawLag: acceptedAt - releasedAt,
      correctedLag: acceptedAt - receiverOffset - releasedAt + senderOffset,
      withinLimit:
        acceptedAt - receiverOffset - releasedAt + senderOffset <=
        suppliedLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    releasedAt: 100,
    acceptedAt: 110,
    suppliedLimit: 12,
    senderOffset: 1,
    receiverOffset: -1,
  },
  output: { rawLag: 10, correctedLag: 12, withinLimit: true },
} satisfies ToolExample<Input, Output>;
export const biosecurityInventoryCustodyHandoverLagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosecurity/biosecurity-inventory-custody-handover-lag",
      title: "Biosecurity Inventory Custody Handover Lag Tool",
      description:
        "Calculate biosecurity inventory custody handover lag from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          releasedAt: { type: "number" },
          acceptedAt: { type: "number" },
          suppliedLimit: { type: "number", minimum: 0 },
          senderOffset: { type: "number" },
          receiverOffset: { type: "number" },
        },
        required: [
          "releasedAt",
          "acceptedAt",
          "suppliedLimit",
          "senderOffset",
          "receiverOffset",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          rawLag: { type: "number" },
          correctedLag: { type: "number" },
          withinLimit: { type: "boolean" },
        },
        required: ["rawLag", "correctedLag", "withinLimit"],
      },
      ports: {
        inputs: [
          {
            id: "releasedAt",
            label: "Released At",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "acceptedAt",
            label: "Accepted At",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedLimit",
            label: "Supplied Limit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "senderOffset",
            label: "Sender Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "receiverOffset",
            label: "Receiver Offset",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "rawLag", label: "Raw Lag", valueType: { type: "number" } },
          {
            id: "correctedLag",
            label: "Corrected Lag",
            valueType: { type: "number" },
          },
          {
            id: "withinLimit",
            label: "Within Limit",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosecurityInventoryCustodyHandoverLagTool.execute;
export default biosecurityInventoryCustodyHandoverLagTool;
