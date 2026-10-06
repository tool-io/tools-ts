import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly outboundElapsedMinutes: number;
  readonly returnElapsedMinutes: number;
};
export type Output = { readonly roundTripMinutes: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outboundElapsedMinutes: { type: "number", minimum: 0 },
    returnElapsedMinutes: { type: "number", minimum: 0 },
  },
  required: ["outboundElapsedMinutes", "returnElapsedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { roundTripMinutes: { type: "number" } },
  required: ["roundTripMinutes"],
} as const;
/** Sum explicit outbound and return routing durations for one administrative record hop. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { outboundElapsedMinutes, returnElapsedMinutes } = request;
  const compute = (): Output => {
    H.domain(outboundElapsedMinutes >= 0, "outboundElapsedMinutes");
    H.domain(returnElapsedMinutes >= 0, "returnElapsedMinutes");
    return { roundTripMinutes: outboundElapsedMinutes + returnElapsedMinutes };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { outboundElapsedMinutes: 12, returnElapsedMinutes: 8 },
  output: { roundTripMinutes: 20 },
} satisfies ToolExample<Input, Output>;
export const recordRoutingReturnHopDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/record-routing-return-hop-delay",
    title: "Record Routing Return Hop Delay",
    description:
      "Sum explicit outbound and return routing durations for one administrative record hop.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outboundElapsedMinutes: { type: "number", minimum: 0 },
        returnElapsedMinutes: { type: "number", minimum: 0 },
      },
      required: ["outboundElapsedMinutes", "returnElapsedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { roundTripMinutes: { type: "number" } },
      required: ["roundTripMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "outboundElapsedMinutes",
          label: "Outbound Elapsed Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnElapsedMinutes",
          label: "Return Elapsed Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "roundTripMinutes",
          label: "Round Trip Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recordRoutingReturnHopDelayTool.execute;
export default recordRoutingReturnHopDelayTool;
