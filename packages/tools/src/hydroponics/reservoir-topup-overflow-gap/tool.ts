import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialVolume: number;
  readonly addedVolume: number;
  readonly removedVolume: number;
  readonly capacity: number;
  readonly measuredFinal: number;
};
export type Output = {
  readonly predictedBeforeOverflow: number;
  readonly overflow: number;
  readonly expectedFinal: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialVolume: { type: "number", minimum: 0 },
    addedVolume: { type: "number", minimum: 0 },
    removedVolume: { type: "number", minimum: 0 },
    capacity: { type: "number", minimum: 0 },
    measuredFinal: { type: "number", minimum: 0 },
  },
  required: [
    "initialVolume",
    "addedVolume",
    "removedVolume",
    "capacity",
    "measuredFinal",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedBeforeOverflow: { type: "number" },
    overflow: { type: "number" },
    expectedFinal: { type: "number" },
    residual: { type: "number" },
  },
  required: [
    "predictedBeforeOverflow",
    "overflow",
    "expectedFinal",
    "residual",
  ],
} as const;
/** Supplied lumped reservoir ledger assuming overflow occurs after net addition/removal. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialVolume, addedVolume, removedVolume, capacity, measuredFinal } =
    request;
  const compute = (): Output => {
    H.domain(
      initialVolume >= 0 &&
        addedVolume >= 0 &&
        removedVolume >= 0 &&
        removedVolume <= initialVolume + addedVolume &&
        capacity >= 0 &&
        initialVolume <= capacity &&
        measuredFinal >= 0,
    );
    return {
      predictedBeforeOverflow: initialVolume + addedVolume - removedVolume,
      overflow: Math.max(
        0,
        initialVolume + addedVolume - removedVolume - capacity,
      ),
      expectedFinal: Math.min(
        capacity,
        initialVolume + addedVolume - removedVolume,
      ),
      residual:
        measuredFinal -
        Math.min(capacity, initialVolume + addedVolume - removedVolume),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialVolume: 80,
    addedVolume: 40,
    removedVolume: 10,
    capacity: 100,
    measuredFinal: 95,
  },
  output: {
    predictedBeforeOverflow: 110,
    overflow: 10,
    expectedFinal: 100,
    residual: -5,
  },
} satisfies ToolExample<Input, Output>;
export const reservoirTopupOverflowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hydroponics/reservoir-topup-overflow-gap",
    title: "Reservoir Topup Overflow Gap Tool",
    description:
      "Supplied lumped reservoir ledger assuming overflow occurs after net addition/removal.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        initialVolume: { type: "number", minimum: 0 },
        addedVolume: { type: "number", minimum: 0 },
        removedVolume: { type: "number", minimum: 0 },
        capacity: { type: "number", minimum: 0 },
        measuredFinal: { type: "number", minimum: 0 },
      },
      required: [
        "initialVolume",
        "addedVolume",
        "removedVolume",
        "capacity",
        "measuredFinal",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedBeforeOverflow: { type: "number" },
        overflow: { type: "number" },
        expectedFinal: { type: "number" },
        residual: { type: "number" },
      },
      required: [
        "predictedBeforeOverflow",
        "overflow",
        "expectedFinal",
        "residual",
      ],
    },
    ports: {
      inputs: [
        {
          id: "initialVolume",
          label: "Initial Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedVolume",
          label: "Added Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "removedVolume",
          label: "Removed Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredFinal",
          label: "Measured Final",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "predictedBeforeOverflow",
          label: "Predicted Before Overflow",
          valueType: { type: "number" },
        },
        { id: "overflow", label: "Overflow", valueType: { type: "number" } },
        {
          id: "expectedFinal",
          label: "Expected Final",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = reservoirTopupOverflowGapTool.execute;
export default reservoirTopupOverflowGapTool;
