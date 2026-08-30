import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly carbonCount: number;
  readonly hydrogenCount: number;
  readonly oxygenCount: number;
  readonly hcBoundary: number;
  readonly ocBoundary: number;
}>;
export type Output = Readonly<{
  readonly hToC: number;
  readonly oToC: number;
  readonly region: string;
}>;
export const calculate = (input: Input): Output => {
  if (
    input.carbonCount <= 0 ||
    Math.min(input.hydrogenCount, input.oxygenCount) < 0
  )
    simpleError(
      "carbonCount",
      "Carbon must be positive and atom counts nonnegative.",
    );
  const hToC = input.hydrogenCount / input.carbonCount,
    oToC = input.oxygenCount / input.carbonCount;
  return {
    hToC,
    oToC,
    region: `${hToC >= input.hcBoundary ? "high" : "low"}-H-${oToC >= input.ocBoundary ? "high" : "low"}-O`,
  };
};
export const exampleInput = {
  carbonCount: 10,
  hydrogenCount: 20,
  oxygenCount: 5,
  hcBoundary: 1,
  ocBoundary: 0.4,
} satisfies Input;
export const exampleOutput = {
  hToC: 2,
  oToC: 0.5,
  region: "high-H-high-O",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/van-krevelen-coordinates",
  title: "Van Krevelen Coordinates",
  description:
    "Map elemental H/C and O/C ratios into caller-selected Van Krevelen regions.",
  inputs: [
    { id: "carbonCount", kind: "number", label: "Carbon count" },
    { id: "hydrogenCount", kind: "number", label: "Hydrogen count" },
    { id: "oxygenCount", kind: "number", label: "Oxygen count" },
    { id: "hcBoundary", kind: "number", label: "Hc boundary" },
    { id: "ocBoundary", kind: "number", label: "Oc boundary" },
  ],
  outputs: [
    { id: "hToC", kind: "number", label: "H to c" },
    { id: "oToC", kind: "number", label: "O to c" },
    { id: "region", kind: "string", label: "Region" },
  ],
  calculate: (value) =>
    calculate({
      carbonCount: value.carbonCount as number,
      hydrogenCount: value.hydrogenCount as number,
      oxygenCount: value.oxygenCount as number,
      hcBoundary: value.hcBoundary as number,
      ocBoundary: value.ocBoundary as number,
    }),
});
export const run = tool.execute;
export default tool;
