import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceNamespace: string;
  readonly publicEventId: string;
  readonly sourceVersion: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceNamespace: { type: "string", maxLength: 8192, minLength: 1 },
    publicEventId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sourceNamespace", "publicEventId", "sourceVersion"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Build an explicit source-qualified public-event version key without verifying events or performing probabilistic matching. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceNamespace, publicEventId, sourceVersion } = request;
  const compute = (): Output => {
    H.domain(sourceNamespace.length > 0, "sourceNamespace");
    H.domain(publicEventId.length > 0, "publicEventId");
    H.domain(sourceVersion.length > 0, "sourceVersion");
    return {
      token: JSON.stringify([sourceNamespace, publicEventId, sourceVersion]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceNamespace: "SRC17",
    publicEventId: "EV2",
    sourceVersion: "v2",
  },
  output: { token: '["SRC17","EV2","v2"]' },
} satisfies ToolExample<Input, Output>;
export const ceasefirePublicEventDoubleCountKeyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["peace-studies", "peace studies", "social sciences"],
      keywords: ["peace studies", "social sciences"],
    },
    id: "peace-studies/ceasefire-public-event-double-count-key",
    title: "Ceasefire Public Event Double Count Key",
    description:
      "Build an explicit source-qualified public-event version key without verifying events or performing probabilistic matching.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceNamespace: { type: "string", maxLength: 8192, minLength: 1 },
        publicEventId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceVersion: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sourceNamespace", "publicEventId", "sourceVersion"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "sourceNamespace",
          label: "Source Namespace",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "publicEventId",
          label: "Public Event Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceVersion",
          label: "Source Version",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = ceasefirePublicEventDoubleCountKeyTool.execute;
export default ceasefirePublicEventDoubleCountKeyTool;
