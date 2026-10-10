import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly screenRequiredRecorded: boolean;
  readonly screenCompletedRecorded: boolean;
  readonly transferRecorded: boolean;
};
export type Output = {
  readonly pendingScreen: boolean;
  readonly pendingAtTransfer: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    screenRequiredRecorded: { type: "boolean" },
    screenCompletedRecorded: { type: "boolean" },
    transferRecorded: { type: "boolean" },
  },
  required: [
    "screenRequiredRecorded",
    "screenCompletedRecorded",
    "transferRecorded",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pendingScreen: { type: "boolean" },
    pendingAtTransfer: { type: "boolean" },
  },
  required: ["pendingScreen", "pendingAtTransfer"],
} as const;
/** Combine explicit transfer and screening-record flags without selecting screening requirements or approving transfer. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { screenRequiredRecorded, screenCompletedRecorded, transferRecorded } =
    request;
  const compute = (): Output => {
    return {
      pendingScreen: screenRequiredRecorded && !screenCompletedRecorded,
      pendingAtTransfer:
        transferRecorded && screenRequiredRecorded && !screenCompletedRecorded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    screenRequiredRecorded: true,
    screenCompletedRecorded: false,
    transferRecorded: true,
  },
  output: { pendingScreen: true, pendingAtTransfer: true },
} satisfies ToolExample<Input, Output>;
export const neonatalTransferPendingscreenFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neonatology", "health and medicine"],
      keywords: ["neonatology", "health and medicine"],
    },
    id: "neonatology/neonatal-transfer-pending-screen-flag",
    title: "Neonatal Transfer Pending Screen Flag",
    description:
      "Combine explicit transfer and screening-record flags without selecting screening requirements or approving transfer.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        screenRequiredRecorded: { type: "boolean" },
        screenCompletedRecorded: { type: "boolean" },
        transferRecorded: { type: "boolean" },
      },
      required: [
        "screenRequiredRecorded",
        "screenCompletedRecorded",
        "transferRecorded",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pendingScreen: { type: "boolean" },
        pendingAtTransfer: { type: "boolean" },
      },
      required: ["pendingScreen", "pendingAtTransfer"],
    },
    ports: {
      inputs: [
        {
          id: "screenRequiredRecorded",
          label: "Screen Required Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "screenCompletedRecorded",
          label: "Screen Completed Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "transferRecorded",
          label: "Transfer Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "pendingScreen",
          label: "Pending Screen",
          valueType: { type: "boolean" },
        },
        {
          id: "pendingAtTransfer",
          label: "Pending At Transfer",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = neonatalTransferPendingscreenFlagTool.execute;
export default neonatalTransferPendingscreenFlagTool;
