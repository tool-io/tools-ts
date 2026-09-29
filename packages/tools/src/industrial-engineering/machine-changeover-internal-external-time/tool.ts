import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly internalBefore: number;
  readonly externalBefore: number;
  readonly movedToExternal: number;
  readonly eliminatedInternal: number;
  readonly eliminatedExternal: number;
};
export type Output = {
  readonly internalAfter: number;
  readonly externalAfter: number;
  readonly downtimeReduction: number;
  readonly totalReduction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    internalBefore: { type: "number", minimum: 0 },
    externalBefore: { type: "number", minimum: 0 },
    movedToExternal: { type: "number", minimum: 0 },
    eliminatedInternal: { type: "number", minimum: 0 },
    eliminatedExternal: { type: "number", minimum: 0 },
  },
  required: [
    "internalBefore",
    "externalBefore",
    "movedToExternal",
    "eliminatedInternal",
    "eliminatedExternal",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    internalAfter: { type: "number" },
    externalAfter: { type: "number" },
    downtimeReduction: { type: "number" },
    totalReduction: { type: "number" },
  },
  required: [
    "internalAfter",
    "externalAfter",
    "downtimeReduction",
    "totalReduction",
  ],
} as const;
/** Explicit SMED time ledger; moving work external reduces downtime but does not by itself reduce total work. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    internalBefore,
    externalBefore,
    movedToExternal,
    eliminatedInternal,
    eliminatedExternal,
  } = request;
  const compute = (): Output => {
    H.domain(
      internalBefore >= 0 &&
        externalBefore >= 0 &&
        movedToExternal >= 0 &&
        eliminatedInternal >= 0 &&
        eliminatedExternal >= 0 &&
        movedToExternal + eliminatedInternal <= internalBefore &&
        eliminatedExternal <= externalBefore + movedToExternal,
    );
    return {
      internalAfter: internalBefore - movedToExternal - eliminatedInternal,
      externalAfter: externalBefore + movedToExternal - eliminatedExternal,
      downtimeReduction: movedToExternal + eliminatedInternal,
      totalReduction: eliminatedInternal + eliminatedExternal,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    internalBefore: 40,
    externalBefore: 20,
    movedToExternal: 10,
    eliminatedInternal: 5,
    eliminatedExternal: 5,
  },
  output: {
    internalAfter: 25,
    externalAfter: 25,
    downtimeReduction: 15,
    totalReduction: 10,
  },
} satisfies ToolExample<Input, Output>;
export const machineChangeoverInternalExternalTimeTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "industrial-engineering/machine-changeover-internal-external-time",
      title: "Machine Changeover Internal External Time Tool",
      description:
        "Explicit SMED time ledger; moving work external reduces downtime but does not by itself reduce total work.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          internalBefore: { type: "number", minimum: 0 },
          externalBefore: { type: "number", minimum: 0 },
          movedToExternal: { type: "number", minimum: 0 },
          eliminatedInternal: { type: "number", minimum: 0 },
          eliminatedExternal: { type: "number", minimum: 0 },
        },
        required: [
          "internalBefore",
          "externalBefore",
          "movedToExternal",
          "eliminatedInternal",
          "eliminatedExternal",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          internalAfter: { type: "number" },
          externalAfter: { type: "number" },
          downtimeReduction: { type: "number" },
          totalReduction: { type: "number" },
        },
        required: [
          "internalAfter",
          "externalAfter",
          "downtimeReduction",
          "totalReduction",
        ],
      },
      ports: {
        inputs: [
          {
            id: "internalBefore",
            label: "Internal Before",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "externalBefore",
            label: "External Before",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "movedToExternal",
            label: "Moved To External",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eliminatedInternal",
            label: "Eliminated Internal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eliminatedExternal",
            label: "Eliminated External",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "internalAfter",
            label: "Internal After",
            valueType: { type: "number" },
          },
          {
            id: "externalAfter",
            label: "External After",
            valueType: { type: "number" },
          },
          {
            id: "downtimeReduction",
            label: "Downtime Reduction",
            valueType: { type: "number" },
          },
          {
            id: "totalReduction",
            label: "Total Reduction",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = machineChangeoverInternalExternalTimeTool.execute;
export default machineChangeoverInternalExternalTimeTool;
