import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly orderedUnits: number;
  readonly receivedUnits: number;
};
export type Output = {
  readonly stillOrderedUnits: number;
  readonly extraReceivedUnits: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orderedUnits: { type: "integer", minimum: 0 },
    receivedUnits: { type: "integer", minimum: 0 },
  },
  required: ["orderedUnits", "receivedUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stillOrderedUnits: { type: "integer" },
    extraReceivedUnits: { type: "integer" },
  },
  required: ["stillOrderedUnits", "extraReceivedUnits"],
} as const;
/** Compare explicit ordered and received unit counts without asserting that unreceived units are contractually backordered. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { orderedUnits, receivedUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(orderedUnits) &&
        orderedUnits >= 0 &&
        orderedUnits <= Number.MAX_SAFE_INTEGER,
      "orderedUnits",
    ),
      orderedUnits);
    (H.domain(
      Number.isSafeInteger(receivedUnits) &&
        receivedUnits >= 0 &&
        receivedUnits <= Number.MAX_SAFE_INTEGER,
      "receivedUnits",
    ),
      receivedUnits);
    return {
      stillOrderedUnits: Math.max(0, orderedUnits - receivedUnits),
      extraReceivedUnits: Math.max(0, receivedUnits - orderedUnits),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { orderedUnits: 100, receivedUnits: 75 },
  output: { stillOrderedUnits: 25, extraReceivedUnits: 0 },
} satisfies ToolExample<Input, Output>;
export const orderedReceivedBackorderedSplitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["supply-chain", "supply chain", "business and finance"],
      keywords: ["supply chain", "business and finance"],
    },
    id: "supply-chain/ordered-received-backordered-split",
    title: "Ordered Received Backordered Split",
    description:
      "Compare explicit ordered and received unit counts without asserting that unreceived units are contractually backordered.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        orderedUnits: { type: "integer", minimum: 0 },
        receivedUnits: { type: "integer", minimum: 0 },
      },
      required: ["orderedUnits", "receivedUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stillOrderedUnits: { type: "integer" },
        extraReceivedUnits: { type: "integer" },
      },
      required: ["stillOrderedUnits", "extraReceivedUnits"],
    },
    ports: {
      inputs: [
        {
          id: "orderedUnits",
          label: "Ordered Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "receivedUnits",
          label: "Received Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "stillOrderedUnits",
          label: "Still Ordered Units",
          valueType: { type: "integer" },
        },
        {
          id: "extraReceivedUnits",
          label: "Extra Received Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = orderedReceivedBackorderedSplitTool.execute;
export default orderedReceivedBackorderedSplitTool;
