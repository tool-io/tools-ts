import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preparedMilliliters: number;
  readonly residualMilliliters: number;
  readonly documentedWasteMilliliters: number;
};
export type Output = { readonly unaccountedDifferenceMilliliters: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preparedMilliliters: { type: "number", minimum: 0 },
    residualMilliliters: { type: "number", minimum: 0 },
    documentedWasteMilliliters: { type: "number", minimum: 0 },
  },
  required: [
    "preparedMilliliters",
    "residualMilliliters",
    "documentedWasteMilliliters",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unaccountedDifferenceMilliliters: { type: "number" } },
  required: ["unaccountedDifferenceMilliliters"],
} as const;
/** Reconcile explicitly recorded prepared, residual, and waste feed volumes without equating the difference with swallowed intake. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    preparedMilliliters,
    residualMilliliters,
    documentedWasteMilliliters,
  } = request;
  const compute = (): Output => {
    H.domain(
      preparedMilliliters >= 0 &&
        residualMilliliters >= 0 &&
        documentedWasteMilliliters >= 0,
      "preparedMilliliters",
    );
    return {
      unaccountedDifferenceMilliliters:
        preparedMilliliters - residualMilliliters - documentedWasteMilliliters,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preparedMilliliters: 60,
    residualMilliliters: 10,
    documentedWasteMilliliters: 5,
  },
  output: { unaccountedDifferenceMilliliters: 45 },
} satisfies ToolExample<Input, Output>;
export const infantFeedPreparedResidualVolumeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["neonatology", "health and medicine"],
      keywords: ["neonatology", "health and medicine"],
    },
    id: "neonatology/infant-feed-prepared-residual-volume",
    title: "Infant Feed Prepared Residual Volume",
    description:
      "Reconcile explicitly recorded prepared, residual, and waste feed volumes without equating the difference with swallowed intake.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preparedMilliliters: { type: "number", minimum: 0 },
        residualMilliliters: { type: "number", minimum: 0 },
        documentedWasteMilliliters: { type: "number", minimum: 0 },
      },
      required: [
        "preparedMilliliters",
        "residualMilliliters",
        "documentedWasteMilliliters",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unaccountedDifferenceMilliliters: { type: "number" } },
      required: ["unaccountedDifferenceMilliliters"],
    },
    ports: {
      inputs: [
        {
          id: "preparedMilliliters",
          label: "Prepared Milliliters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "residualMilliliters",
          label: "Residual Milliliters",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "documentedWasteMilliliters",
          label: "Documented Waste Milliliters",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "unaccountedDifferenceMilliliters",
          label: "Unaccounted Difference Milliliters",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = infantFeedPreparedResidualVolumeTool.execute;
export default infantFeedPreparedResidualVolumeTool;
