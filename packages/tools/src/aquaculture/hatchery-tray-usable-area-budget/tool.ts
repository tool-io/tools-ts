import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly width: number;
  readonly length: number;
  readonly edgeMargin: number;
  readonly occupiedArea: number;
};
export type Output = { readonly usableArea: number; readonly freeArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    width: { type: "number" },
    length: { type: "number" },
    edgeMargin: { type: "number", minimum: 0 },
    occupiedArea: { type: "number", minimum: 0 },
  },
  required: ["width", "length", "edgeMargin", "occupiedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { usableArea: { type: "number" }, freeArea: { type: "number" } },
  required: ["usableArea", "freeArea"],
} as const;
/** Calculate hatchery tray usable area budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { width, length, edgeMargin, occupiedArea } = request;
  const compute = (): Output => {
    H.domain(
      edgeMargin >= 0 &&
        width >= 2 * edgeMargin &&
        length >= 2 * edgeMargin &&
        occupiedArea >= 0 &&
        occupiedArea <= (width - 2 * edgeMargin) * (length - 2 * edgeMargin),
    );
    return {
      usableArea: (width - 2 * edgeMargin) * (length - 2 * edgeMargin),
      freeArea:
        (width - 2 * edgeMargin) * (length - 2 * edgeMargin) - occupiedArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { width: 10, length: 20, edgeMargin: 1, occupiedArea: 100 },
  output: { usableArea: 144, freeArea: 44 },
} satisfies ToolExample<Input, Output>;
export const hatcheryTrayUsableAreaBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/hatchery-tray-usable-area-budget",
    title: "Hatchery Tray Usable Area Budget Tool",
    description:
      "Calculate hatchery tray usable area budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        width: { type: "number" },
        length: { type: "number" },
        edgeMargin: { type: "number", minimum: 0 },
        occupiedArea: { type: "number", minimum: 0 },
      },
      required: ["width", "length", "edgeMargin", "occupiedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableArea: { type: "number" },
        freeArea: { type: "number" },
      },
      required: ["usableArea", "freeArea"],
    },
    ports: {
      inputs: [
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edgeMargin",
          label: "Edge Margin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupiedArea",
          label: "Occupied Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableArea",
          label: "Usable Area",
          valueType: { type: "number" },
        },
        { id: "freeArea", label: "Free Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = hatcheryTrayUsableAreaBudgetTool.execute;
export default hatcheryTrayUsableAreaBudgetTool;
