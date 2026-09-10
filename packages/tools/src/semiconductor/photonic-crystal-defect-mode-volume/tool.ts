import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  positive,
  nonnegative,
  sum,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlySampledEnergyDensities: readonly number[];
  readonly actualRepresentedCellVolumesCubicMeters: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlySampledEnergyDensities",
    label: "Independently sampled energy densities",
    kind: "numberList",
  },
  {
    id: "actualRepresentedCellVolumesCubicMeters",
    label: "Actual represented cell volumes cubic meters",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlySampledEnergyDensities,
    input.actualRepresentedCellVolumesCubicMeters,
    "cells",
  );
  input.independentlySampledEnergyDensities.forEach((v) =>
    nonnegative(v, "energy-density"),
  );
  input.actualRepresentedCellVolumesCubicMeters.forEach((v) =>
    positive(v, "cellvolume"),
  );
  return {
    conditionalSampledDefectModeVolumeCubicMeters:
      sum(
        input.independentlySampledEnergyDensities.map(
          (v, i) => v * input.actualRepresentedCellVolumesCubicMeters[i],
        ),
      ) /
      positive(
        Math.max(...input.independentlySampledEnergyDensities),
        "sampled-maximum",
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlySampledEnergyDensities: [1, 2],
    actualRepresentedCellVolumesCubicMeters: [1, 1],
  },
  output: { result: { conditionalSampledDefectModeVolumeCubicMeters: 1.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/photonic-crystal-defect-mode-volume",
  title: "Semiconductor Photonic Crystal Defect Mode Volume Calculator",
  description:
    "Declared sampled photonic mode volume integral energy-density/maxenergy-density with nonoverlapping represented cells. Full domain, dispersive energy definition and unsampled peak externally established; not infer localization, Qor emitter enhancement.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
