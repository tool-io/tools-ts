import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableBags: number;
  readonly usedBags: number;
};
export type Output = { readonly remainingBags: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableBags: { type: "integer", minimum: 0 },
    usedBags: { type: "integer", minimum: 0 },
  },
  required: ["availableBags", "usedBags"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingBags: { type: "integer" } },
  required: ["remainingBags"],
} as const;
/** Subtract supplied used net-bag count from available count, preserving negative stock discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableBags, usedBags } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(availableBags) &&
        availableBags >= 0 &&
        availableBags <= Number.MAX_SAFE_INTEGER,
      "availableBags",
    ),
      availableBags);
    (H.domain(
      Number.isSafeInteger(usedBags) &&
        usedBags >= 0 &&
        usedBags <= Number.MAX_SAFE_INTEGER,
      "usedBags",
    ),
      usedBags);
    return { remainingBags: availableBags - usedBags };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableBags: 20, usedBags: 8 },
  output: { remainingBags: 12 },
} satisfies ToolExample<Input, Output>;
export const aquacultureNetBagCountRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["aquaculture", "agriculture"],
      keywords: ["aquaculture", "agriculture"],
    },
    id: "aquaculture/aquaculture-net-bag-count-remainder",
    title: "Aquaculture Net Bag Count Remainder",
    description:
      "Subtract supplied used net-bag count from available count, preserving negative stock discrepancies.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableBags: { type: "integer", minimum: 0 },
        usedBags: { type: "integer", minimum: 0 },
      },
      required: ["availableBags", "usedBags"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingBags: { type: "integer" } },
      required: ["remainingBags"],
    },
    ports: {
      inputs: [
        {
          id: "availableBags",
          label: "Available Bags",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "usedBags",
          label: "Used Bags",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingBags",
          label: "Remaining Bags",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = aquacultureNetBagCountRemainderTool.execute;
export default aquacultureNetBagCountRemainderTool;
