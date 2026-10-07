import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preRollStartSeconds: number;
  readonly itemStartSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preRollStartSeconds: { type: "number" },
    itemStartSeconds: { type: "number" },
  },
  required: ["preRollStartSeconds", "itemStartSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit pre-roll start from broadcast item-start markers on a shared timeline. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preRollStartSeconds, itemStartSeconds } = request;
  const compute = (): Output => {
    return { signedGap: itemStartSeconds - preRollStartSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { preRollStartSeconds: 12, itemStartSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const broadcastItemPreRollDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["communication", "social sciences"],
      keywords: ["communication", "social sciences"],
    },
    id: "communication/broadcast-item-pre-roll-duration",
    title: "Broadcast Item Pre Roll Duration",
    description:
      "Subtract explicit pre-roll start from broadcast item-start markers on a shared timeline.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preRollStartSeconds: { type: "number" },
        itemStartSeconds: { type: "number" },
      },
      required: ["preRollStartSeconds", "itemStartSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "preRollStartSeconds",
          label: "Pre Roll Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "itemStartSeconds",
          label: "Item Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = broadcastItemPreRollDurationTool.execute;
export default broadcastItemPreRollDurationTool;
