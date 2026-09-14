import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly waterLiters: number;
  readonly troughLengthM: number;
  readonly troughWidthM: number;
  readonly occupiedVolumeLiters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "waterLiters", label: "Water liters", kind: "number" },
  { id: "troughLengthM", label: "Trough length m", kind: "number" },
  { id: "troughWidthM", label: "Trough width m", kind: "number" },
  {
    id: "occupiedVolumeLiters",
    label: "Occupied volume liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.waterLiters, "water");
  nonnegative(i.occupiedVolumeLiters, "displacement");
  positive(i.troughLengthM, "length");
  positive(i.troughWidthM, "width");
  return {
    fillDepthM:
      (i.waterLiters + i.occupiedVolumeLiters) /
      (1000 * i.troughLengthM * i.troughWidthM),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    waterLiters: 10,
    troughLengthM: 2,
    troughWidthM: 0.5,
    occupiedVolumeLiters: 5,
  },
  output: { result: { fillDepthM: 0.015 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/subirrigation-trough-fill-depth",
  title: "Subirrigation Trough Fill Depth Calculator",
  description:
    "Rectangular trough liquid depth including measured submerged displacement; assumes constant section, no capillary irrigation prediction.",
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
