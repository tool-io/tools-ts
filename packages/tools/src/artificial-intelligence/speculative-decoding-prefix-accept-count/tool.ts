import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly accepted: readonly boolean[] };
export type Output = {
  readonly acceptedPrefix: number;
  readonly firstRejected: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accepted: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["accepted"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    acceptedPrefix: { type: "integer" },
    firstRejected: { type: "integer" },
  },
  required: ["acceptedPrefix", "firstRejected"],
} as const;
/** Count only the consecutive accepted draft prefix; later flags do not bypass a rejection. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { accepted } = request;
  const compute = (): Output => {
    const firstRejected = accepted.indexOf(false);
    return {
      acceptedPrefix: firstRejected < 0 ? accepted.length : firstRejected,
      firstRejected,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { accepted: [true, true, false, true] },
  output: { acceptedPrefix: 2, firstRejected: 2 },
} satisfies ToolExample<Input, Output>;
export const speculativeDecodingPrefixAcceptCountTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "artificial-intelligence/speculative-decoding-prefix-accept-count",
      title: "Speculative Decoding Prefix Accept Count Tool",
      description:
        "Count only the consecutive accepted draft prefix; later flags do not bypass a rejection.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          accepted: {
            type: "array",
            maxItems: 256,
            items: { type: "boolean" },
          },
        },
        required: ["accepted"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          acceptedPrefix: { type: "integer" },
          firstRejected: { type: "integer" },
        },
        required: ["acceptedPrefix", "firstRejected"],
      },
      ports: {
        inputs: [
          {
            id: "accepted",
            label: "Accepted",
            required: true,
            valueType: { type: "list", items: { type: "boolean" } },
          },
        ],
        outputs: [
          {
            id: "acceptedPrefix",
            label: "Accepted Prefix",
            valueType: { type: "integer" },
          },
          {
            id: "firstRejected",
            label: "First Rejected",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = speculativeDecodingPrefixAcceptCountTool.execute;
export default speculativeDecodingPrefixAcceptCountTool;
