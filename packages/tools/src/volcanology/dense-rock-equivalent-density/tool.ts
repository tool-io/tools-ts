import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly tephraVolumeM3: number;
  readonly tephraBulkDensityKgM3: number;
  readonly denseRockDensityKgM3: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tephraVolumeM3", label: "Tephra volume m3", kind: "number" },
  {
    id: "tephraBulkDensityKgM3",
    label: "Tephra bulk density kg m3",
    kind: "number",
  },
  {
    id: "denseRockDensityKgM3",
    label: "Dense rock density kg m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.tephraVolumeM3, "volume");
  positive(i.tephraBulkDensityKgM3, "bulk density");
  positive(i.denseRockDensityKgM3, "rock density");
  return {
    denseRockEquivalentVolumeM3:
      (i.tephraVolumeM3 * i.tephraBulkDensityKgM3) / i.denseRockDensityKgM3,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    tephraVolumeM3: 100,
    tephraBulkDensityKgM3: 500,
    denseRockDensityKgM3: 2500,
  },
  output: { result: { denseRockEquivalentVolumeM3: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/dense-rock-equivalent-density",
  title: "Dense Rock Equivalent Density Calculator",
  description:
    "Mass-conserving dense-rock-equivalent volume from caller measured bulk and dense-rock densities; void/compaction assumptions external.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
