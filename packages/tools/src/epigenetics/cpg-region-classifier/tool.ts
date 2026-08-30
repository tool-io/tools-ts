import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cpgCoordinateBp: number;
  readonly islandStartBp: number;
  readonly islandEndBp: number;
  readonly shoreDistanceBp: number;
  readonly shelfDistanceBp: number;
}>;
export type Output = Readonly<{
  readonly distanceToIslandBp: number;
  readonly regionClass: string;
}>;

export const calculate = (input: Input): Output => {
  if (
    input.islandStartBp > input.islandEndBp ||
    input.shoreDistanceBp < 0 ||
    input.shelfDistanceBp < input.shoreDistanceBp
  )
    simpleError(
      "islandStartBp",
      "Island bounds and distances must be ordered.",
    );
  const distanceToIslandBp =
    input.cpgCoordinateBp < input.islandStartBp
      ? input.islandStartBp - input.cpgCoordinateBp
      : Math.max(0, input.cpgCoordinateBp - input.islandEndBp);
  return {
    distanceToIslandBp,
    regionClass:
      distanceToIslandBp === 0
        ? "island"
        : distanceToIslandBp <= input.shoreDistanceBp
          ? "shore"
          : distanceToIslandBp <= input.shelfDistanceBp
            ? "shelf"
            : "open-sea",
  };
};

export const exampleInput = {
  cpgCoordinateBp: 2500,
  islandStartBp: 1000,
  islandEndBp: 2000,
  shoreDistanceBp: 2000,
  shelfDistanceBp: 4000,
} satisfies Input;
export const exampleOutput = {
  distanceToIslandBp: 500,
  regionClass: "shore",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/cpg-region-classifier",
  title: "CPG Region Classifier",
  description: "Classify a CpG’s distance from a caller-supplied island.",
  inputs: [
    { id: "cpgCoordinateBp", kind: "number", label: "CpG coordinate bp" },
    { id: "islandStartBp", kind: "number", label: "Island start bp" },
    { id: "islandEndBp", kind: "number", label: "Island end bp" },
    { id: "shoreDistanceBp", kind: "number", label: "Shore distance bp" },
    { id: "shelfDistanceBp", kind: "number", label: "Shelf distance bp" },
  ],
  outputs: [
    {
      id: "distanceToIslandBp",
      kind: "number",
      label: "Distance to island bp",
    },
    {
      id: "regionClass",
      kind: "string",
      label: "Region class",
      enum: ["island", "shore", "shelf", "open-sea"],
    },
  ],
  calculate: (value) =>
    calculate({
      cpgCoordinateBp: value.cpgCoordinateBp as number,
      islandStartBp: value.islandStartBp as number,
      islandEndBp: value.islandEndBp as number,
      shoreDistanceBp: value.shoreDistanceBp as number,
      shelfDistanceBp: value.shelfDistanceBp as number,
    }),
});
export const run = tool.execute;
export default tool;
