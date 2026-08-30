import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, dateDay, literal } from "../batch-shared.js";
export type Input = Readonly<{
  readonly shipmentDate: string;
  readonly deliveryDate: string;
  readonly reportingCutoffDate: string;
  readonly callerControlTransferEvent: string;
  readonly otherRecognitionEvidenceSatisfied: boolean;
}>;
export type Output = Readonly<{
  readonly declaredControlTransferDate: string;
  readonly transferOnOrBeforeCutoff: boolean;
  readonly revenueCutoffCandidateSupported: boolean;
}>;
const inputFields = [
  { id: "shipmentDate", label: "Shipment date", kind: "string" },
  { id: "deliveryDate", label: "Delivery date", kind: "string" },
  { id: "reportingCutoffDate", label: "Reporting cutoff date", kind: "string" },
  {
    id: "callerControlTransferEvent",
    label: "Caller control transfer event",
    kind: "string",
  },
  {
    id: "otherRecognitionEvidenceSatisfied",
    label: "Other recognition evidence satisfied",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const shipped = dateDay(input.shipmentDate),
    delivered = dateDay(input.deliveryDate),
    cutoff = dateDay(input.reportingCutoffDate);
  if (delivered < shipped)
    simpleError(
      "delivery",
      "Delivery cannot precede shipment in this caller ledger.",
    );
  literal(
    input.callerControlTransferEvent,
    ["shipment", "destination"],
    "policy",
  );
  const event =
      input.callerControlTransferEvent === "shipment"
        ? input.shipmentDate
        : input.deliveryDate,
    within = dateDay(event) <= cutoff;
  return {
    declaredControlTransferDate: event,
    transferOnOrBeforeCutoff: within,
    revenueCutoffCandidateSupported:
      within && input.otherRecognitionEvidenceSatisfied,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  shipmentDate: "2025-12-30",
  deliveryDate: "2026-01-05",
  reportingCutoffDate: "2025-12-31",
  callerControlTransferEvent: "shipment",
  otherRecognitionEvidenceSatisfied: true,
} satisfies Input;
export const exampleOutput = {
  declaredControlTransferDate: "2025-12-30",
  transferOnOrBeforeCutoff: true,
  revenueCutoffCandidateSupported: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "accounting/revenue-cutoff-shipping-terms-fob-checker",
  title: "Revenue Cutoff Shipping Terms FOB Checker",
  description:
    "Screen observed shipping/delivery cutoff under explicit caller control-transfer event; FOB labels alone do not establish control or revenue recognition, and other contractual/performance evidence must be supplied.",
  inputs: inputFields,
  outputs: [
    {
      id: "declaredControlTransferDate",
      label: "Declared control transfer date",
      kind: "string",
    },
    {
      id: "transferOnOrBeforeCutoff",
      label: "Transfer on or before cutoff",
      kind: "boolean",
    },
    {
      id: "revenueCutoffCandidateSupported",
      label: "Revenue cutoff candidate supported",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      shipmentDate: value.shipmentDate as string,
      deliveryDate: value.deliveryDate as string,
      reportingCutoffDate: value.reportingCutoffDate as string,
      callerControlTransferEvent: value.callerControlTransferEvent as string,
      otherRecognitionEvidenceSatisfied:
        value.otherRecognitionEvidenceSatisfied as boolean,
    }),
});
export const run = tool.execute;
export default tool;
