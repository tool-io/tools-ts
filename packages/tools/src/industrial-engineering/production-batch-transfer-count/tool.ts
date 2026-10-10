import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly batchUnits: number;
  readonly transferContainerUnits: number;
};
export type Output = {
  readonly fullContainers: number;
  readonly remainderUnits: number;
  readonly containersNeeded: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    batchUnits: { type: "integer", minimum: 0 },
    transferContainerUnits: { type: "integer", minimum: 1 },
  },
  required: ["batchUnits", "transferContainerUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fullContainers: { type: "integer" },
    remainderUnits: { type: "integer" },
    containersNeeded: { type: "integer" },
  },
  required: ["fullContainers", "remainderUnits", "containersNeeded"],
} as const;
/** Split supplied batch units into full transfer containers, loose remainder and ceiling container count using exact integer division. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { batchUnits, transferContainerUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(batchUnits) &&
        batchUnits >= 0 &&
        batchUnits <= Number.MAX_SAFE_INTEGER,
      "batchUnits",
    ),
      batchUnits);
    (H.domain(
      Number.isSafeInteger(transferContainerUnits) &&
        transferContainerUnits >= 1 &&
        transferContainerUnits <= Number.MAX_SAFE_INTEGER,
      "transferContainerUnits",
    ),
      transferContainerUnits);
    return (() => {
      const a = BigInt(batchUnits),
        b = BigInt(transferContainerUnits);
      return {
        fullContainers: Number(a / b),
        remainderUnits: Number(a % b),
        containersNeeded: Number(a / b + (a % b === 0n ? 0n : 1n)),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { batchUnits: 105, transferContainerUnits: 20 },
  output: { fullContainers: 5, remainderUnits: 5, containersNeeded: 6 },
} satisfies ToolExample<Input, Output>;
export const productionBatchTransferCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/production-batch-transfer-count",
    title: "Production Batch Transfer Count Tool",
    description:
      "Split supplied batch units into full transfer containers, loose remainder and ceiling container count using exact integer division.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        batchUnits: { type: "integer", minimum: 0 },
        transferContainerUnits: { type: "integer", minimum: 1 },
      },
      required: ["batchUnits", "transferContainerUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fullContainers: { type: "integer" },
        remainderUnits: { type: "integer" },
        containersNeeded: { type: "integer" },
      },
      required: ["fullContainers", "remainderUnits", "containersNeeded"],
    },
    ports: {
      inputs: [
        {
          id: "batchUnits",
          label: "Batch Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "transferContainerUnits",
          label: "Transfer Container Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "fullContainers",
          label: "Full Containers",
          valueType: { type: "integer" },
        },
        {
          id: "remainderUnits",
          label: "Remainder Units",
          valueType: { type: "integer" },
        },
        {
          id: "containersNeeded",
          label: "Containers Needed",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = productionBatchTransferCountTool.execute;
export default productionBatchTransferCountTool;
