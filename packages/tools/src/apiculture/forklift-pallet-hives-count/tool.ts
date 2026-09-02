import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  exactProduct,
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly palletUsableWidthCm: number;
  readonly palletUsableLengthCm: number;
  readonly hiveFootprintWidthCm: number;
  readonly hiveFootprintLengthCm: number;
  readonly callerInterHiveGapCm: number;
}>;
export type Output = Readonly<{
  readonly bestUniformGridHiveCount: number;
  readonly rotatedOrientationSelected: boolean;
}>;
const inputFields = [
  {
    id: "palletUsableWidthCm",
    label: "Pallet usable width cm",
    kind: "number",
  },
  {
    id: "palletUsableLengthCm",
    label: "Pallet usable length cm",
    kind: "number",
  },
  {
    id: "hiveFootprintWidthCm",
    label: "Hive footprint width cm",
    kind: "number",
  },
  {
    id: "hiveFootprintLengthCm",
    label: "Hive footprint length cm",
    kind: "number",
  },
  {
    id: "callerInterHiveGapCm",
    label: "Caller inter hive gap cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.palletUsableWidthCm, "palletUsableWidthCm");
  positive(input.palletUsableLengthCm, "palletUsableLengthCm");
  positive(input.hiveFootprintWidthCm, "hiveFootprintWidthCm");
  positive(input.hiveFootprintLengthCm, "hiveFootprintLengthCm");
  nonnegative(input.callerInterHiveGapCm, "callerInterHiveGapCm");
  const g = input.callerInterHiveGapCm,
    fit = (w: number, l: number) =>
      exactProduct(
        Math.floor((input.palletUsableWidthCm + g) / (w + g)),
        Math.floor((input.palletUsableLengthCm + g) / (l + g)),
      ),
    a = fit(input.hiveFootprintWidthCm, input.hiveFootprintLengthCm),
    b = fit(input.hiveFootprintLengthCm, input.hiveFootprintWidthCm);
  return {
    bestUniformGridHiveCount: Math.max(a, b),
    rotatedOrientationSelected: b > a,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  palletUsableWidthCm: 100,
  palletUsableLengthCm: 100,
  hiveFootprintWidthCm: 40,
  hiveFootprintLengthCm: 50,
  callerInterHiveGapCm: 10,
} satisfies Input;
export const exampleOutput = {
  bestUniformGridHiveCount: 2,
  rotatedOrientationSelected: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/forklift-pallet-hives-count",
  title: "Forklift Pallet Hives Count Calculator",
  description:
    "Best of two uniform axis-aligned hive packing grids on caller pallet usable dimensions with gaps, not globally mixed-orientation optimum or forklift/restraint safety. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "bestUniformGridHiveCount",
      label: "Best uniform grid hive count",
      kind: "number",
    },
    {
      id: "rotatedOrientationSelected",
      label: "Rotated orientation selected",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      palletUsableWidthCm: value.palletUsableWidthCm as number,
      palletUsableLengthCm: value.palletUsableLengthCm as number,
      hiveFootprintWidthCm: value.hiveFootprintWidthCm as number,
      hiveFootprintLengthCm: value.hiveFootprintLengthCm as number,
      callerInterHiveGapCm: value.callerInterHiveGapCm as number,
    }),
});
export const run = tool.execute;
export default tool;
