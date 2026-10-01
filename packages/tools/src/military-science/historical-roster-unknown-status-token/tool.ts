import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly token: string;
  readonly unknownTokens: readonly string[];
  readonly knownTokens: readonly string[];
};
export type Output = { readonly status: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    token: { type: "string", maxLength: 8192 },
    unknownTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    knownTokens: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["token", "unknownTokens", "knownTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { status: { type: "string", maxLength: 8192 } },
  required: ["status"],
} as const;
/** Classify supplied historical roster vocabulary without inferring personal status. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { token, unknownTokens, knownTokens } = request;
  const compute = (): Output => {
    H.domain(!unknownTokens.some((x) => knownTokens.includes(x)));
    return {
      status: unknownTokens.includes(token)
        ? "unknown"
        : knownTokens.includes(token)
          ? "known"
          : "unrecognized",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    token: "?",
    unknownTokens: ["?"],
    knownTokens: ["present", "absent"],
  },
  output: { status: "unknown" },
} satisfies ToolExample<Input, Output>;
export const historicalRosterUnknownStatusTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/historical-roster-unknown-status-token",
    title: "Historical Roster Unknown Status Token Tool",
    description:
      "Classify supplied historical roster vocabulary without inferring personal status.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        token: { type: "string", maxLength: 8192 },
        unknownTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        knownTokens: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["token", "unknownTokens", "knownTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { status: { type: "string", maxLength: 8192 } },
      required: ["status"],
    },
    ports: {
      inputs: [
        {
          id: "token",
          label: "Token",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unknownTokens",
          label: "Unknown Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "knownTokens",
          label: "Known Tokens",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        { id: "status", label: "Status", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = historicalRosterUnknownStatusTokenTool.execute;
export default historicalRosterUnknownStatusTokenTool;
