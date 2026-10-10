import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedMilliliters: number;
  readonly elapsedMinutes: number;
};
export type Output = {
  readonly millilitersPerMinute: number;
  readonly microlitersPerSecond: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedMilliliters: { type: "number", minimum: 0 },
    elapsedMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["collectedMilliliters", "elapsedMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    millilitersPerMinute: { type: "number" },
    microlitersPerSecond: { type: "number" },
  },
  required: ["millilitersPerMinute", "microlitersPerSecond"],
} as const;
/** Convert explicit collected saliva volume and duration to two compatible average flow units without a clinical classification. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedMilliliters, elapsedMinutes } = request;
  const compute = (): Output => {
    H.domain(collectedMilliliters >= 0, "collectedMilliliters");
    (H.domain(elapsedMinutes > 0, "elapsedMinutes"), elapsedMinutes);
    return {
      millilitersPerMinute: collectedMilliliters / elapsedMinutes,
      microlitersPerSecond:
        (collectedMilliliters * 1000) / (elapsedMinutes * 60),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectedMilliliters: 3, elapsedMinutes: 5 },
  output: { millilitersPerMinute: 0.6, microlitersPerSecond: 10 },
} satisfies ToolExample<Input, Output>;
export const salivaryCollectionFlowUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["otolaryngology", "health and medicine"],
      keywords: ["otolaryngology", "health and medicine"],
    },
    id: "otolaryngology/salivary-collection-flow-unit",
    title: "Salivary Collection Flow Unit",
    description:
      "Convert explicit collected saliva volume and duration to two compatible average flow units without a clinical classification.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedMilliliters: { type: "number", minimum: 0 },
        elapsedMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["collectedMilliliters", "elapsedMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        millilitersPerMinute: { type: "number" },
        microlitersPerSecond: { type: "number" },
      },
      required: ["millilitersPerMinute", "microlitersPerSecond"],
    },
    ports: {
      inputs: [
        {
          id: "collectedMilliliters",
          label: "Collected Milliliters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedMinutes",
          label: "Elapsed Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "millilitersPerMinute",
          label: "Milliliters Per Minute",
          valueType: { type: "number" },
        },
        {
          id: "microlitersPerSecond",
          label: "Microliters Per Second",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = salivaryCollectionFlowUnitTool.execute;
export default salivaryCollectionFlowUnitTool;
