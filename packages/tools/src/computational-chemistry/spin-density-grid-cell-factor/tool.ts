import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spinDensity: number;
  readonly cellVolume: number;
  readonly multiplicityWeight: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spinDensity: { type: "number" },
    cellVolume: { type: "number", minimum: 0 },
    multiplicityWeight: { type: "number", minimum: 0 },
  },
  required: ["spinDensity", "cellVolume", "multiplicityWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate spin density grid cell factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spinDensity, cellVolume, multiplicityWeight } = request;
  const compute = (): Output => {
    H.domain(cellVolume >= 0 && multiplicityWeight >= 0);
    return { contribution: spinDensity * cellVolume * multiplicityWeight };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spinDensity: 0.2, cellVolume: 3, multiplicityWeight: 2 },
  output: { contribution: 1.2000000000000002 },
} satisfies ToolExample<Input, Output>;
export const spinDensityGridCellFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-chemistry/spin-density-grid-cell-factor",
    title: "Spin Density Grid Cell Factor Tool",
    description:
      "Calculate spin density grid cell factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spinDensity: { type: "number" },
        cellVolume: { type: "number", minimum: 0 },
        multiplicityWeight: { type: "number", minimum: 0 },
      },
      required: ["spinDensity", "cellVolume", "multiplicityWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "spinDensity",
          label: "Spin Density",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cellVolume",
          label: "Cell Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "multiplicityWeight",
          label: "Multiplicity Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = spinDensityGridCellFactorTool.execute;
export default spinDensityGridCellFactorTool;
