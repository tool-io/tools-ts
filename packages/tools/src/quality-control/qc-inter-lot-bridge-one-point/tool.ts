import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldLotSignal: number;
  readonly newLotSignal: number;
  readonly oldBlank: number;
  readonly newBlank: number;
};
export type Output = {
  readonly oldCorrected: number;
  readonly newCorrected: number;
  readonly ratio: number;
  readonly difference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldLotSignal: { type: "number" },
    newLotSignal: { type: "number" },
    oldBlank: { type: "number" },
    newBlank: { type: "number" },
  },
  required: ["oldLotSignal", "newLotSignal", "oldBlank", "newBlank"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldCorrected: { type: "number" },
    newCorrected: { type: "number" },
    ratio: { type: "number" },
    difference: { type: "number" },
  },
  required: ["oldCorrected", "newCorrected", "ratio", "difference"],
} as const;
/** Calculate qc inter lot bridge one point from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oldLotSignal, newLotSignal, oldBlank, newBlank } = request;
  const compute = (): Output => {
    H.domain(oldLotSignal !== oldBlank);
    return {
      oldCorrected: oldLotSignal - oldBlank,
      newCorrected: newLotSignal - newBlank,
      ratio: (newLotSignal - newBlank) / (oldLotSignal - oldBlank),
      difference: newLotSignal - newBlank - oldLotSignal + oldBlank,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oldLotSignal: 100, newLotSignal: 120, oldBlank: 10, newBlank: 12 },
  output: { oldCorrected: 90, newCorrected: 108, ratio: 1.2, difference: 18 },
} satisfies ToolExample<Input, Output>;
export const qcInterLotBridgeOnePointTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/qc-inter-lot-bridge-one-point",
    title: "QC Inter Lot Bridge One Point Tool",
    description:
      "Calculate qc inter lot bridge one point from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldLotSignal: { type: "number" },
        newLotSignal: { type: "number" },
        oldBlank: { type: "number" },
        newBlank: { type: "number" },
      },
      required: ["oldLotSignal", "newLotSignal", "oldBlank", "newBlank"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldCorrected: { type: "number" },
        newCorrected: { type: "number" },
        ratio: { type: "number" },
        difference: { type: "number" },
      },
      required: ["oldCorrected", "newCorrected", "ratio", "difference"],
    },
    ports: {
      inputs: [
        {
          id: "oldLotSignal",
          label: "Old Lot Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newLotSignal",
          label: "New Lot Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldBlank",
          label: "Old Blank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newBlank",
          label: "New Blank",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "oldCorrected",
          label: "Old Corrected",
          valueType: { type: "number" },
        },
        {
          id: "newCorrected",
          label: "New Corrected",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcInterLotBridgeOnePointTool.execute;
export default qcInterLotBridgeOnePointTool;
