import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly capacity: number;
  readonly measuredFill: number;
  readonly reservedHeadspace: number;
};
export type Output = {
  readonly physicalGap: number;
  readonly usableGap: number;
  readonly exceedsSuppliedFill: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    capacity: { type: "number", minimum: 0 },
    measuredFill: { type: "number", minimum: 0 },
    reservedHeadspace: { type: "number", minimum: 0 },
  },
  required: ["capacity", "measuredFill", "reservedHeadspace"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalGap: { type: "number" },
    usableGap: { type: "number" },
    exceedsSuppliedFill: { type: "boolean" },
  },
  required: ["physicalGap", "usableGap", "exceedsSuppliedFill"],
} as const;
/** Compare recorded container fill and caller-supplied reserved space. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { capacity, measuredFill, reservedHeadspace } = request;
  const compute = (): Output => {
    H.domain(
      capacity >= 0 &&
        measuredFill >= 0 &&
        reservedHeadspace >= 0 &&
        reservedHeadspace <= capacity,
    );
    return {
      physicalGap: capacity - measuredFill,
      usableGap: capacity - measuredFill - reservedHeadspace,
      exceedsSuppliedFill: measuredFill > capacity - reservedHeadspace,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { capacity: 100, measuredFill: 70, reservedHeadspace: 10 },
  output: { physicalGap: 30, usableGap: 20, exceedsSuppliedFill: false },
} satisfies ToolExample<Input, Output>;
export const biosafetyWasteContainerFillGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/biosafety-waste-container-fill-gap",
    title: "Biosafety Waste Container Fill Gap Tool",
    description:
      "Compare recorded container fill and caller-supplied reserved space.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        capacity: { type: "number", minimum: 0 },
        measuredFill: { type: "number", minimum: 0 },
        reservedHeadspace: { type: "number", minimum: 0 },
      },
      required: ["capacity", "measuredFill", "reservedHeadspace"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        physicalGap: { type: "number" },
        usableGap: { type: "number" },
        exceedsSuppliedFill: { type: "boolean" },
      },
      required: ["physicalGap", "usableGap", "exceedsSuppliedFill"],
    },
    ports: {
      inputs: [
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredFill",
          label: "Measured Fill",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservedHeadspace",
          label: "Reserved Headspace",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "physicalGap",
          label: "Physical Gap",
          valueType: { type: "number" },
        },
        { id: "usableGap", label: "Usable Gap", valueType: { type: "number" } },
        {
          id: "exceedsSuppliedFill",
          label: "Exceeds Supplied Fill",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = biosafetyWasteContainerFillGapTool.execute;
export default biosafetyWasteContainerFillGapTool;
