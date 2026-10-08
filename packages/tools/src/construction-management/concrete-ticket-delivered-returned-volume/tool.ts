import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ticketVolume: number;
  readonly returnedVolume: number;
  readonly recordedPlacedVolume: number;
};
export type Output = {
  readonly netDeliveredVolume: number;
  readonly placementClosureResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ticketVolume: { type: "number", minimum: 0 },
    returnedVolume: { type: "number", minimum: 0 },
    recordedPlacedVolume: { type: "number", minimum: 0 },
  },
  required: ["ticketVolume", "returnedVolume", "recordedPlacedVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netDeliveredVolume: { type: "number" },
    placementClosureResidual: { type: "number" },
  },
  required: ["netDeliveredVolume", "placementClosureResidual"],
} as const;
/** Reconcile a concrete delivery ticket, returned volume and recorded placement without estimating strength or accepting a batch. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ticketVolume, returnedVolume, recordedPlacedVolume } = request;
  const compute = (): Output => {
    H.domain(
      ticketVolume >= 0 &&
        returnedVolume >= 0 &&
        returnedVolume <= ticketVolume &&
        recordedPlacedVolume >= 0,
      "ticketVolume",
    );
    return {
      netDeliveredVolume: ticketVolume - returnedVolume,
      placementClosureResidual:
        ticketVolume - returnedVolume - recordedPlacedVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ticketVolume: 8, returnedVolume: 0.5, recordedPlacedVolume: 7 },
  output: { netDeliveredVolume: 7.5, placementClosureResidual: 0.5 },
} satisfies ToolExample<Input, Output>;
export const concreteTicketDeliveredReturnedVolumeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "construction-management",
          "construction management",
          "engineering",
        ],
        keywords: ["construction management", "engineering"],
      },
      id: "construction-management/concrete-ticket-delivered-returned-volume",
      title: "Concrete Ticket Delivered Returned Volume",
      description:
        "Reconcile a concrete delivery ticket, returned volume and recorded placement without estimating strength or accepting a batch.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          ticketVolume: { type: "number", minimum: 0 },
          returnedVolume: { type: "number", minimum: 0 },
          recordedPlacedVolume: { type: "number", minimum: 0 },
        },
        required: ["ticketVolume", "returnedVolume", "recordedPlacedVolume"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netDeliveredVolume: { type: "number" },
          placementClosureResidual: { type: "number" },
        },
        required: ["netDeliveredVolume", "placementClosureResidual"],
      },
      ports: {
        inputs: [
          {
            id: "ticketVolume",
            label: "Ticket Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "returnedVolume",
            label: "Returned Volume",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recordedPlacedVolume",
            label: "Recorded Placed Volume",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "netDeliveredVolume",
            label: "Net Delivered Volume",
            valueType: { type: "number" },
          },
          {
            id: "placementClosureResidual",
            label: "Placement Closure Residual",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = concreteTicketDeliveredReturnedVolumeTool.execute;
export default concreteTicketDeliveredReturnedVolumeTool;
