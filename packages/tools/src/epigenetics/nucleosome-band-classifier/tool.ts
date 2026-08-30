import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly insertSizeBp: number;
  readonly bandToleranceBp: number;
}>;
export type Output = Readonly<{
  readonly bandClass: string;
  readonly nearestBandDistanceBp: number;
}>;

export const calculate = (input: Input): Output => {
  const bands = [
      { v: 0, c: "nucleosome-free" },
      { v: 200, c: "mono-nucleosome" },
      { v: 400, c: "di-nucleosome" },
    ] as const,
    nearest = bands.reduce((a, b) =>
      Math.abs(input.insertSizeBp - b.v) < Math.abs(input.insertSizeBp - a.v)
        ? b
        : a,
    ),
    nearestBandDistanceBp = Math.abs(input.insertSizeBp - nearest.v);
  return {
    bandClass:
      nearestBandDistanceBp <= input.bandToleranceBp ? nearest.c : "other",
    nearestBandDistanceBp,
  };
};

export const exampleInput = {
  insertSizeBp: 210,
  bandToleranceBp: 25,
} satisfies Input;
export const exampleOutput = {
  bandClass: "mono-nucleosome",
  nearestBandDistanceBp: 10,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      insertSizeBp: input.insertSizeBp as number,
      bandToleranceBp: input.bandToleranceBp as number,
    }),
  description: "Classify an insert size into nucleosome periodicity bands.",
  id: "epigenetics/nucleosome-band-classifier",
  inputs: [
    {
      id: "insertSizeBp",
      label: "Insert size",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
    {
      id: "bandToleranceBp",
      label: "Band tolerance",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
  ],
  outputs: [
    {
      id: "bandClass",
      label: "Nucleosome band",
      kind: "string",
      enum: ["nucleosome-free", "mono-nucleosome", "di-nucleosome", "other"],
    },
    {
      id: "nearestBandDistanceBp",
      label: "Distance to nearest band",
      kind: "number",
      minimum: 0,
      unit: "bp",
    },
  ],
  title: "Nucleosome Band Classifier",
});

export const run = tool.execute;
export default tool;
