import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowLength: number;
  readonly startBuffer: number;
  readonly endBuffer: number;
  readonly overlapCredit: number;
};
export type Output = {
  readonly plantableLength: number;
  readonly excludedLength: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowLength: { type: "number", minimum: 0 },
    startBuffer: { type: "number", minimum: 0 },
    endBuffer: { type: "number", minimum: 0 },
    overlapCredit: { type: "number", minimum: 0 },
  },
  required: ["rowLength", "startBuffer", "endBuffer", "overlapCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    plantableLength: { type: "number" },
    excludedLength: { type: "number" },
  },
  required: ["plantableLength", "excludedLength"],
} as const;
/** Supplied row-length budget with independently measured overlapping end buffers. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rowLength, startBuffer, endBuffer, overlapCredit } = request;
  const compute = (): Output => {
    H.domain(
      rowLength >= 0 &&
        startBuffer >= 0 &&
        endBuffer >= 0 &&
        overlapCredit >= 0 &&
        overlapCredit <= Math.min(startBuffer, endBuffer) &&
        startBuffer + endBuffer - overlapCredit <= rowLength,
    );
    return {
      plantableLength: rowLength - startBuffer - endBuffer + overlapCredit,
      excludedLength: startBuffer + endBuffer - overlapCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rowLength: 100, startBuffer: 10, endBuffer: 20, overlapCredit: 0 },
  output: { plantableLength: 70, excludedLength: 30 },
} satisfies ToolExample<Input, Output>;
export const treeBufferRowEndCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/tree-buffer-row-end-credit",
    title: "Tree Buffer Row End Credit Tool",
    description:
      "Supplied row-length budget with independently measured overlapping end buffers.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowLength: { type: "number", minimum: 0 },
        startBuffer: { type: "number", minimum: 0 },
        endBuffer: { type: "number", minimum: 0 },
        overlapCredit: { type: "number", minimum: 0 },
      },
      required: ["rowLength", "startBuffer", "endBuffer", "overlapCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        plantableLength: { type: "number" },
        excludedLength: { type: "number" },
      },
      required: ["plantableLength", "excludedLength"],
    },
    ports: {
      inputs: [
        {
          id: "rowLength",
          label: "Row Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "startBuffer",
          label: "Start Buffer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "endBuffer",
          label: "End Buffer",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapCredit",
          label: "Overlap Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "plantableLength",
          label: "Plantable Length",
          valueType: { type: "number" },
        },
        {
          id: "excludedLength",
          label: "Excluded Length",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeBufferRowEndCreditTool.execute;
export default treeBufferRowEndCreditTool;
