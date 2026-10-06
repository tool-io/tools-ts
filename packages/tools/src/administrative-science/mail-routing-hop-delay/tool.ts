import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly receivedTimestampSeconds: number;
  readonly forwardedTimestampSeconds: number;
};
export type Output = { readonly hopDelaySeconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    receivedTimestampSeconds: { type: "number" },
    forwardedTimestampSeconds: { type: "number" },
  },
  required: ["receivedTimestampSeconds", "forwardedTimestampSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { hopDelaySeconds: { type: "number" } },
  required: ["hopDelaySeconds"],
} as const;
/** Measure one recorded administrative mail-routing hop on a shared timestamp scale. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { receivedTimestampSeconds, forwardedTimestampSeconds } = request;
  const compute = (): Output => {
    H.domain(
      forwardedTimestampSeconds >= receivedTimestampSeconds,
      "forwardedTimestampSeconds",
    );
    return {
      hopDelaySeconds: forwardedTimestampSeconds - receivedTimestampSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { receivedTimestampSeconds: 100, forwardedTimestampSeconds: 145 },
  output: { hopDelaySeconds: 45 },
} satisfies ToolExample<Input, Output>;
export const mailRoutingHopDelayTool = H.defineSchemaCalculation<Input, Output>(
  {
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
      id: "administrative-science/mail-routing-hop-delay",
      title: "Mail Routing Hop Delay",
      description:
        "Measure one recorded administrative mail-routing hop on a shared timestamp scale.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          receivedTimestampSeconds: { type: "number" },
          forwardedTimestampSeconds: { type: "number" },
        },
        required: ["receivedTimestampSeconds", "forwardedTimestampSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { hopDelaySeconds: { type: "number" } },
        required: ["hopDelaySeconds"],
      },
      ports: {
        inputs: [
          {
            id: "receivedTimestampSeconds",
            label: "Received Timestamp Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "forwardedTimestampSeconds",
            label: "Forwarded Timestamp Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "hopDelaySeconds",
            label: "Hop Delay Seconds",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  },
);
export const run = mailRoutingHopDelayTool.execute;
export default mailRoutingHopDelayTool;
