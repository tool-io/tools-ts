import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scopeId: string;
  readonly channelId: string;
  readonly accessoryId: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scopeId: { type: "string", maxLength: 8192, minLength: 1 },
    channelId: { type: "string", maxLength: 8192, minLength: 1 },
    accessoryId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["scopeId", "channelId", "accessoryId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record explicit endoscopy scope, channel and accessory identifiers without verifying compatibility or safe use. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scopeId, channelId, accessoryId } = request;
  const compute = (): Output => {
    H.domain(scopeId.length > 0, "scopeId");
    H.domain(channelId.length > 0, "channelId");
    H.domain(accessoryId.length > 0, "accessoryId");
    return { token: JSON.stringify([scopeId, channelId, accessoryId]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scopeId: "S17", channelId: "C4", accessoryId: "A2" },
  output: { token: '["S17","C4","A2"]' },
} satisfies ToolExample<Input, Output>;
export const endoscopyScopeChannelAccessoryLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "gastroenterology/endoscopy-scope-channel-accessory-label",
      title: "Endoscopy Scope Channel Accessory Label Tool",
      description:
        "Record explicit endoscopy scope, channel and accessory identifiers without verifying compatibility or safe use.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scopeId: { type: "string", maxLength: 8192, minLength: 1 },
          channelId: { type: "string", maxLength: 8192, minLength: 1 },
          accessoryId: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["scopeId", "channelId", "accessoryId"],
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
            id: "scopeId",
            label: "Scope Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "channelId",
            label: "Channel Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "accessoryId",
            label: "Accessory Id",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = endoscopyScopeChannelAccessoryLabelTool.execute;
export default endoscopyScopeChannelAccessoryLabelTool;
