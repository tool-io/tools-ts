import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingCount: number;
  readonly receivedCount: number;
  readonly transferredCount: number;
  readonly recordedClosingCount: number;
};
export type Output = { readonly unexplainedResidual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingCount: { type: "integer", minimum: 0 },
    receivedCount: { type: "integer", minimum: 0 },
    transferredCount: { type: "integer", minimum: 0 },
    recordedClosingCount: { type: "integer", minimum: 0 },
  },
  required: [
    "openingCount",
    "receivedCount",
    "transferredCount",
    "recordedClosingCount",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unexplainedResidual: { type: "integer" } },
  required: ["unexplainedResidual"],
} as const;
/** Reconcile explicit administrative inventory counts with exact integer arithmetic without describing material use or acquisition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    openingCount,
    receivedCount,
    transferredCount,
    recordedClosingCount,
  } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingCount) &&
        openingCount >= 0 &&
        openingCount <= Number.MAX_SAFE_INTEGER,
      "openingCount",
    ),
      openingCount);
    (H.domain(
      Number.isSafeInteger(receivedCount) &&
        receivedCount >= 0 &&
        receivedCount <= Number.MAX_SAFE_INTEGER,
      "receivedCount",
    ),
      receivedCount);
    (H.domain(
      Number.isSafeInteger(transferredCount) &&
        transferredCount >= 0 &&
        transferredCount <= Number.MAX_SAFE_INTEGER,
      "transferredCount",
    ),
      transferredCount);
    (H.domain(
      Number.isSafeInteger(recordedClosingCount) &&
        recordedClosingCount >= 0 &&
        recordedClosingCount <= Number.MAX_SAFE_INTEGER,
      "recordedClosingCount",
    ),
      recordedClosingCount);
    return {
      unexplainedResidual: Number(
        BigInt(openingCount) +
          BigInt(receivedCount) -
          BigInt(transferredCount) -
          BigInt(recordedClosingCount),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingCount: 20,
    receivedCount: 4,
    transferredCount: 3,
    recordedClosingCount: 20,
  },
  output: { unexplainedResidual: 1 },
} satisfies ToolExample<Input, Output>;
export const biosecurityInventoryCountResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["biosecurity", "research and quality management"],
      keywords: ["biosecurity", "research and quality management"],
    },
    id: "biosecurity/biosecurity-inventory-count-residual",
    title: "Biosecurity Inventory Count Residual",
    description:
      "Reconcile explicit administrative inventory counts with exact integer arithmetic without describing material use or acquisition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingCount: { type: "integer", minimum: 0 },
        receivedCount: { type: "integer", minimum: 0 },
        transferredCount: { type: "integer", minimum: 0 },
        recordedClosingCount: { type: "integer", minimum: 0 },
      },
      required: [
        "openingCount",
        "receivedCount",
        "transferredCount",
        "recordedClosingCount",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unexplainedResidual: { type: "integer" } },
      required: ["unexplainedResidual"],
    },
    ports: {
      inputs: [
        {
          id: "openingCount",
          label: "Opening Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "receivedCount",
          label: "Received Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transferredCount",
          label: "Transferred Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "recordedClosingCount",
          label: "Recorded Closing Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unexplainedResidual",
          label: "Unexplained Residual",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = biosecurityInventoryCountResidualTool.execute;
export default biosecurityInventoryCountResidualTool;
