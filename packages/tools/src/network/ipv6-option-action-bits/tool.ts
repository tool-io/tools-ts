import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly optionType: number };
export type Output = {
  readonly action: number;
  readonly mutable: boolean;
  readonly actionToken: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { optionType: { type: "integer", minimum: 0, maximum: 255 } },
  required: ["optionType"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    action: { type: "integer" },
    mutable: { type: "boolean" },
    actionToken: { type: "string", maxLength: 8192 },
  },
  required: ["action", "mutable", "actionToken"],
} as const;
/** Inspect IPv6 option-type action and mutable-data bits; no packet parsing. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { optionType } = request;
  const compute = (): Output => {
    H.integer(optionType, 0, 255);
    return {
      action: optionType >>> 6,
      mutable: (optionType & 32) !== 0,
      actionToken: [
        "skip",
        "discard",
        "discard-send-icmp",
        "discard-send-icmp-unless-multicast",
      ][optionType >>> 6],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { optionType: 194 },
  output: {
    action: 3,
    mutable: false,
    actionToken: "discard-send-icmp-unless-multicast",
  },
} satisfies ToolExample<Input, Output>;
export const ipv6OptionActionBitsTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "network/ipv6-option-action-bits",
    title: "IPv6 Option Action Bits Tool",
    description:
      "Inspect IPv6 option-type action and mutable-data bits; no packet parsing.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { optionType: { type: "integer", minimum: 0, maximum: 255 } },
      required: ["optionType"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        action: { type: "integer" },
        mutable: { type: "boolean" },
        actionToken: { type: "string", maxLength: 8192 },
      },
      required: ["action", "mutable", "actionToken"],
    },
    ports: {
      inputs: [
        {
          id: "optionType",
          label: "Option Type",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "action", label: "Action", valueType: { type: "integer" } },
        { id: "mutable", label: "Mutable", valueType: { type: "boolean" } },
        {
          id: "actionToken",
          label: "Action Token",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = ipv6OptionActionBitsTool.execute;
export default ipv6OptionActionBitsTool;
