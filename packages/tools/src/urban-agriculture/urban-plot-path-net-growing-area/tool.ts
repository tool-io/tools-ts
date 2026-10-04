import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossArea: number;
  readonly paths: number;
  readonly structures: number;
  readonly overlap: number;
};
export type Output = { readonly netArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossArea: { type: "number", minimum: 0 },
    paths: { type: "number", minimum: 0 },
    structures: { type: "number", minimum: 0 },
    overlap: { type: "number", minimum: 0 },
  },
  required: ["grossArea", "paths", "structures", "overlap"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { netArea: { type: "number" } },
  required: ["netArea"],
} as const;
/** Calculate urban plot path net growing area from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossArea, paths, structures, overlap } = request;
  const compute = (): Output => {
    H.domain(
      grossArea >= 0 &&
        paths >= 0 &&
        structures >= 0 &&
        overlap >= 0 &&
        overlap <= Math.min(paths, structures) &&
        paths + structures - overlap <= grossArea,
    );
    return { netArea: grossArea - paths - structures + overlap };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossArea: 100, paths: 20, structures: 10, overlap: 5 },
  output: { netArea: 75 },
} satisfies ToolExample<Input, Output>;
export const urbanPlotPathNetGrowingAreaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/urban-plot-path-net-growing-area",
    title: "Urban Plot Path Net Growing Area Tool",
    description:
      "Calculate urban plot path net growing area from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossArea: { type: "number", minimum: 0 },
        paths: { type: "number", minimum: 0 },
        structures: { type: "number", minimum: 0 },
        overlap: { type: "number", minimum: 0 },
      },
      required: ["grossArea", "paths", "structures", "overlap"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { netArea: { type: "number" } },
      required: ["netArea"],
    },
    ports: {
      inputs: [
        {
          id: "grossArea",
          label: "Gross Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paths",
          label: "Paths",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "structures",
          label: "Structures",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlap",
          label: "Overlap",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netArea", label: "Net Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = urbanPlotPathNetGrowingAreaTool.execute;
export default urbanPlotPathNetGrowingAreaTool;
