import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bands,
} from "../shared.js";
export type Input = Readonly<{
  readonly crateGrossMassKg: number;
  readonly crateOuterDimensionsM: readonly number[];
  readonly callerDensityClassLowerEdgesKgPerM3: readonly number[];
  readonly declaredTareKg: number;
}>;
export type Output = Readonly<{
  readonly grossCrateDensityKgPerM3: number;
  readonly netPayloadDensityKgPerM3: number;
  readonly callerGrossDensityClassCode: number;
}>;
const inputFields = [
  { id: "crateGrossMassKg", label: "Crate gross mass kg", kind: "number" },
  {
    id: "crateOuterDimensionsM",
    label: "Crate outer dimensions m",
    kind: "numberList",
  },
  {
    id: "callerDensityClassLowerEdgesKgPerM3",
    label: "Caller density class lower edges kg per m3",
    kind: "numberList",
  },
  { id: "declaredTareKg", label: "Declared tare kg", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.crateOuterDimensionsM.forEach((v) =>
    positive(v, "crateOuterDimensionsM"),
  );
  nonnegative(input.crateGrossMassKg, "crateGrossMassKg");
  nonnegative(input.declaredTareKg, "declaredTareKg");
  if (input.crateOuterDimensionsM.length !== 3)
    simpleError("dimensions", "Three external crate dimensions required.");
  const volume = input.crateOuterDimensionsM.reduce((a, b) => a * b, 1),
    g = input.crateGrossMassKg / positive(volume, "volume"),
    net = nonnegative(input.crateGrossMassKg - input.declaredTareKg, "tare");
  return {
    grossCrateDensityKgPerM3: g,
    netPayloadDensityKgPerM3: net / volume,
    callerGrossDensityClassCode: bands(
      input.callerDensityClassLowerEdgesKgPerM3,
      g,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  crateGrossMassKg: 100,
  crateOuterDimensionsM: [1, 2, 0.5],
  callerDensityClassLowerEdgesKgPerM3: [0, 80, 120],
  declaredTareKg: 20,
} satisfies Input;
export const exampleOutput = {
  grossCrateDensityKgPerM3: 100,
  netPayloadDensityKgPerM3: 80,
  callerGrossDensityClassCode: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/crate-density-shipping-classifier",
  title: "Crate Weight Volume Density Shipping Class Classifier",
  description:
    "Separate gross shipping density from payload-per-external-volume density before caller class mapping; not carrier NMFC classification, dangerous-goods status or packing safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "grossCrateDensityKgPerM3",
      label: "Gross crate density kg per m3",
      kind: "number",
    },
    {
      id: "netPayloadDensityKgPerM3",
      label: "Net payload density kg per m3",
      kind: "number",
    },
    {
      id: "callerGrossDensityClassCode",
      label: "Caller gross density class code",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      crateGrossMassKg: value.crateGrossMassKg as number,
      crateOuterDimensionsM: value.crateOuterDimensionsM as readonly number[],
      callerDensityClassLowerEdgesKgPerM3:
        value.callerDensityClassLowerEdgesKgPerM3 as readonly number[],
      declaredTareKg: value.declaredTareKg as number,
    }),
});
export const run = tool.execute;
export default tool;
