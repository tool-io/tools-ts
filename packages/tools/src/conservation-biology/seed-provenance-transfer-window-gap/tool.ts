import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceDay: number;
  readonly transferDay: number;
  readonly suppliedMinDelay: number;
  readonly suppliedMaxDelay: number;
};
export type Output = {
  readonly delay: number;
  readonly lowerSlack: number;
  readonly upperSlack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceDay: { type: "integer" },
    transferDay: { type: "integer" },
    suppliedMinDelay: { type: "integer", minimum: 0 },
    suppliedMaxDelay: { type: "integer" },
  },
  required: [
    "sourceDay",
    "transferDay",
    "suppliedMinDelay",
    "suppliedMaxDelay",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delay: { type: "integer" },
    lowerSlack: { type: "integer" },
    upperSlack: { type: "integer" },
  },
  required: ["delay", "lowerSlack", "upperSlack"],
} as const;
/** Compare supplied provenance-record dates with explicit timing bounds; no biological transfer suitability is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceDay, transferDay, suppliedMinDelay, suppliedMaxDelay } =
    request;
  const compute = (): Output => {
    H.integer(suppliedMinDelay, 0);
    H.integer(suppliedMaxDelay, suppliedMinDelay);
    return {
      delay: transferDay - sourceDay,
      lowerSlack: transferDay - sourceDay - suppliedMinDelay,
      upperSlack: suppliedMaxDelay - transferDay + sourceDay,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sourceDay: 100,
    transferDay: 110,
    suppliedMinDelay: 5,
    suppliedMaxDelay: 20,
  },
  output: { delay: 10, lowerSlack: 5, upperSlack: 10 },
} satisfies ToolExample<Input, Output>;
export const seedProvenanceTransferWindowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "conservation-biology/seed-provenance-transfer-window-gap",
    title: "Seed Provenance Transfer Window Gap Tool",
    description:
      "Compare supplied provenance-record dates with explicit timing bounds; no biological transfer suitability is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceDay: { type: "integer" },
        transferDay: { type: "integer" },
        suppliedMinDelay: { type: "integer", minimum: 0 },
        suppliedMaxDelay: { type: "integer" },
      },
      required: [
        "sourceDay",
        "transferDay",
        "suppliedMinDelay",
        "suppliedMaxDelay",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delay: { type: "integer" },
        lowerSlack: { type: "integer" },
        upperSlack: { type: "integer" },
      },
      required: ["delay", "lowerSlack", "upperSlack"],
    },
    ports: {
      inputs: [
        {
          id: "sourceDay",
          label: "Source Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transferDay",
          label: "Transfer Day",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedMinDelay",
          label: "Supplied Min Delay",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedMaxDelay",
          label: "Supplied Max Delay",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "delay", label: "Delay", valueType: { type: "integer" } },
        {
          id: "lowerSlack",
          label: "Lower Slack",
          valueType: { type: "integer" },
        },
        {
          id: "upperSlack",
          label: "Upper Slack",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedProvenanceTransferWindowGapTool.execute;
export default seedProvenanceTransferWindowGapTool;
