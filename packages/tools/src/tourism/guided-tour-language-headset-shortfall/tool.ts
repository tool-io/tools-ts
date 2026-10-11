import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestedHeadsets: number;
  readonly availableHeadsets: number;
};
export type Output = { readonly shortfall: number; readonly surplus: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestedHeadsets: { type: "integer", minimum: 0 },
    availableHeadsets: { type: "integer", minimum: 0 },
  },
  required: ["requestedHeadsets", "availableHeadsets"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shortfall: { type: "integer" }, surplus: { type: "integer" } },
  required: ["shortfall", "surplus"],
} as const;
/** Compare explicit language-headset request and inventory counts without arranging services. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestedHeadsets, availableHeadsets } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(requestedHeadsets) &&
        requestedHeadsets >= 0 &&
        requestedHeadsets <= Number.MAX_SAFE_INTEGER,
      "requestedHeadsets",
    ),
      requestedHeadsets);
    (H.domain(
      Number.isSafeInteger(availableHeadsets) &&
        availableHeadsets >= 0 &&
        availableHeadsets <= Number.MAX_SAFE_INTEGER,
      "availableHeadsets",
    ),
      availableHeadsets);
    return {
      shortfall: Math.max(0, requestedHeadsets - availableHeadsets),
      surplus: Math.max(0, availableHeadsets - requestedHeadsets),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestedHeadsets: 25, availableHeadsets: 20 },
  output: { shortfall: 5, surplus: 0 },
} satisfies ToolExample<Input, Output>;
export const guidedTourLanguageHeadsetShortfallTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["tourism", "business and finance"],
      keywords: ["tourism", "business and finance"],
    },
    id: "tourism/guided-tour-language-headset-shortfall",
    title: "Guided Tour Language Headset Shortfall",
    description:
      "Compare explicit language-headset request and inventory counts without arranging services.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestedHeadsets: { type: "integer", minimum: 0 },
        availableHeadsets: { type: "integer", minimum: 0 },
      },
      required: ["requestedHeadsets", "availableHeadsets"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shortfall: { type: "integer" },
        surplus: { type: "integer" },
      },
      required: ["shortfall", "surplus"],
    },
    ports: {
      inputs: [
        {
          id: "requestedHeadsets",
          label: "Requested Headsets",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "availableHeadsets",
          label: "Available Headsets",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "shortfall", label: "Shortfall", valueType: { type: "integer" } },
        { id: "surplus", label: "Surplus", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = guidedTourLanguageHeadsetShortfallTool.execute;
export default guidedTourLanguageHeadsetShortfallTool;
