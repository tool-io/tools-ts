import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cellKeys: readonly string[];
  readonly sourceIds: readonly string[];
  readonly supported: readonly boolean[];
};
export type Output = {
  readonly cells: number;
  readonly supportedCells: number;
  readonly distinctSupportingSources: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cellKeys: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    sourceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["cellKeys", "sourceIds", "supported"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cells: { type: "integer" },
    supportedCells: { type: "integer" },
    distinctSupportingSources: { type: "integer" },
  },
  required: ["cells", "supportedCells", "distinctSupportingSources"],
} as const;
/** Calculate representation support cell count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cellKeys, sourceIds, supported } = request;
  const compute = (): Output => {
    H.sameLength(cellKeys, sourceIds);
    H.sameLength(sourceIds, supported);
    return {
      cells: new Set(cellKeys).size,
      supportedCells: new Set(cellKeys.filter((x, i) => supported[i])).size,
      distinctSupportingSources: new Set(
        sourceIds.filter((x, i) => supported[i]),
      ).size,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cellKeys: ["a", "a", "b"],
    sourceIds: ["s1", "s2", "s1"],
    supported: [true, false, true],
  },
  output: { cells: 2, supportedCells: 2, distinctSupportingSources: 1 },
} satisfies ToolExample<Input, Output>;
export const representationSupportCellCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gender-studies/representation-support-cell-count",
    title: "Representation Support Cell Count Tool",
    description:
      "Calculate representation support cell count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cellKeys: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        sourceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        supported: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["cellKeys", "sourceIds", "supported"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cells: { type: "integer" },
        supportedCells: { type: "integer" },
        distinctSupportingSources: { type: "integer" },
      },
      required: ["cells", "supportedCells", "distinctSupportingSources"],
    },
    ports: {
      inputs: [
        {
          id: "cellKeys",
          label: "Cell Keys",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "sourceIds",
          label: "Source Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "supported",
          label: "Supported",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        { id: "cells", label: "Cells", valueType: { type: "integer" } },
        {
          id: "supportedCells",
          label: "Supported Cells",
          valueType: { type: "integer" },
        },
        {
          id: "distinctSupportingSources",
          label: "Distinct Supporting Sources",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = representationSupportCellCountTool.execute;
export default representationSupportCellCountTool;
