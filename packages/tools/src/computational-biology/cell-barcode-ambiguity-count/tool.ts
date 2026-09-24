import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedBarcodes: readonly string[];
  readonly assignedCells: readonly string[];
  readonly unassignedToken: string;
};
export type Output = {
  readonly ambiguousBarcodes: number;
  readonly assignedBarcodes: number;
  readonly unassignedRecords: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedBarcodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    assignedCells: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    unassignedToken: { type: "string", maxLength: 8192 },
  },
  required: ["observedBarcodes", "assignedCells", "unassignedToken"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ambiguousBarcodes: { type: "integer" },
    assignedBarcodes: { type: "integer" },
    unassignedRecords: { type: "integer" },
  },
  required: ["ambiguousBarcodes", "assignedBarcodes", "unassignedRecords"],
} as const;
/** Calculate cell barcode ambiguity count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedBarcodes, assignedCells, unassignedToken } = request;
  const compute = (): Output => {
    H.sameLength(observedBarcodes, assignedCells);
    return (() => {
      const groups = new Map<string, Set<string>>();
      let unassignedRecords = 0;
      observedBarcodes.forEach((b, i) => {
        if (assignedCells[i] === unassignedToken) {
          unassignedRecords++;
          return;
        }
        const s = groups.get(b) ?? new Set<string>();
        s.add(assignedCells[i]);
        groups.set(b, s);
      });
      return {
        ambiguousBarcodes: [...groups.values()].filter((x) => x.size > 1)
          .length,
        assignedBarcodes: groups.size,
        unassignedRecords,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observedBarcodes: ["a", "a", "b"],
    assignedCells: ["c1", "c2", "?"],
    unassignedToken: "?",
  },
  output: { ambiguousBarcodes: 1, assignedBarcodes: 1, unassignedRecords: 1 },
} satisfies ToolExample<Input, Output>;
export const cellBarcodeAmbiguityCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/cell-barcode-ambiguity-count",
    title: "Cell Barcode Ambiguity Count Tool",
    description:
      "Calculate cell barcode ambiguity count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedBarcodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        assignedCells: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        unassignedToken: { type: "string", maxLength: 8192 },
      },
      required: ["observedBarcodes", "assignedCells", "unassignedToken"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ambiguousBarcodes: { type: "integer" },
        assignedBarcodes: { type: "integer" },
        unassignedRecords: { type: "integer" },
      },
      required: ["ambiguousBarcodes", "assignedBarcodes", "unassignedRecords"],
    },
    ports: {
      inputs: [
        {
          id: "observedBarcodes",
          label: "Observed Barcodes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "assignedCells",
          label: "Assigned Cells",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "unassignedToken",
          label: "Unassigned Token",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "ambiguousBarcodes",
          label: "Ambiguous Barcodes",
          valueType: { type: "integer" },
        },
        {
          id: "assignedBarcodes",
          label: "Assigned Barcodes",
          valueType: { type: "integer" },
        },
        {
          id: "unassignedRecords",
          label: "Unassigned Records",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = cellBarcodeAmbiguityCountTool.execute;
export default cellBarcodeAmbiguityCountTool;
