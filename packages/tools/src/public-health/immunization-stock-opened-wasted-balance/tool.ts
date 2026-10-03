import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly received: number;
  readonly opened: number;
  readonly administered: number;
  readonly wastedOpen: number;
  readonly discardedClosed: number;
  readonly dosesPerVial: number;
};
export type Output = {
  readonly closedVials: number;
  readonly openDoseRemainder: number;
  readonly totalUsableDoses: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "integer", minimum: 0 },
    received: { type: "integer", minimum: 0 },
    opened: { type: "integer", minimum: 0 },
    administered: { type: "integer", minimum: 0 },
    wastedOpen: { type: "integer", minimum: 0 },
    discardedClosed: { type: "integer", minimum: 0 },
    dosesPerVial: { type: "integer", minimum: 1 },
  },
  required: [
    "opening",
    "received",
    "opened",
    "administered",
    "wastedOpen",
    "discardedClosed",
    "dosesPerVial",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    closedVials: { type: "integer" },
    openDoseRemainder: { type: "integer" },
    totalUsableDoses: { type: "integer" },
  },
  required: ["closedVials", "openDoseRemainder", "totalUsableDoses"],
} as const;
/** Reconcile supplied closed-vial and opened-dose inventories. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    opening,
    received,
    opened,
    administered,
    wastedOpen,
    discardedClosed,
    dosesPerVial,
  } = request;
  const compute = (): Output => {
    H.integer(opening, 0);
    H.integer(received, 0);
    H.integer(opened, 0);
    H.integer(administered, 0);
    H.integer(wastedOpen, 0);
    H.integer(discardedClosed, 0);
    H.integer(dosesPerVial, 1);
    H.domain(
      opened + discardedClosed <= opening + received &&
        administered + wastedOpen <= opened * dosesPerVial,
    );
    return {
      closedVials: opening + received - opened - discardedClosed,
      openDoseRemainder: opened * dosesPerVial - administered - wastedOpen,
      totalUsableDoses:
        (opening + received - discardedClosed) * dosesPerVial -
        administered -
        wastedOpen,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opening: 10,
    received: 5,
    opened: 4,
    administered: 30,
    wastedOpen: 2,
    discardedClosed: 1,
    dosesPerVial: 10,
  },
  output: { closedVials: 10, openDoseRemainder: 8, totalUsableDoses: 108 },
} satisfies ToolExample<Input, Output>;
export const immunizationStockOpenedWastedBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "public-health/immunization-stock-opened-wasted-balance",
      title: "Immunization Stock Opened Wasted Balance Tool",
      description:
        "Reconcile supplied closed-vial and opened-dose inventories.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opening: { type: "integer", minimum: 0 },
          received: { type: "integer", minimum: 0 },
          opened: { type: "integer", minimum: 0 },
          administered: { type: "integer", minimum: 0 },
          wastedOpen: { type: "integer", minimum: 0 },
          discardedClosed: { type: "integer", minimum: 0 },
          dosesPerVial: { type: "integer", minimum: 1 },
        },
        required: [
          "opening",
          "received",
          "opened",
          "administered",
          "wastedOpen",
          "discardedClosed",
          "dosesPerVial",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          closedVials: { type: "integer" },
          openDoseRemainder: { type: "integer" },
          totalUsableDoses: { type: "integer" },
        },
        required: ["closedVials", "openDoseRemainder", "totalUsableDoses"],
      },
      ports: {
        inputs: [
          {
            id: "opening",
            label: "Opening",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "received",
            label: "Received",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "opened",
            label: "Opened",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "administered",
            label: "Administered",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "wastedOpen",
            label: "Wasted Open",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "discardedClosed",
            label: "Discarded Closed",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "dosesPerVial",
            label: "Doses Per Vial",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "closedVials",
            label: "Closed Vials",
            valueType: { type: "integer" },
          },
          {
            id: "openDoseRemainder",
            label: "Open Dose Remainder",
            valueType: { type: "integer" },
          },
          {
            id: "totalUsableDoses",
            label: "Total Usable Doses",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = immunizationStockOpenedWastedBalanceTool.execute;
export default immunizationStockOpenedWastedBalanceTool;
