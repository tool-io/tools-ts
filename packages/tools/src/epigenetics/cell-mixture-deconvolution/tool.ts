import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedMarkerOne: number;
  readonly observedMarkerTwo: number;
  readonly cellAMarkerOne: number;
  readonly cellAMarkerTwo: number;
  readonly cellBMarkerOne: number;
  readonly cellBMarkerTwo: number;
}>;
export type Output = Readonly<{
  readonly cellAFraction: number;
  readonly cellBFraction: number;
  readonly residualSquared: number;
}>;

export const calculate = (input: Input): Output => {
  const da = input.cellAMarkerOne - input.cellBMarkerOne,
    db = input.cellAMarkerTwo - input.cellBMarkerTwo,
    den = da * da + db * db;
  if (den <= 0)
    simpleError("cellAMarkerOne", "Reference cell profiles must differ.");
  const cellAFraction = Math.max(
      0,
      Math.min(
        1,
        ((input.observedMarkerOne - input.cellBMarkerOne) * da +
          (input.observedMarkerTwo - input.cellBMarkerTwo) * db) /
          den,
      ),
    ),
    cellBFraction = 1 - cellAFraction,
    r1 = input.observedMarkerOne - (input.cellBMarkerOne + cellAFraction * da),
    r2 = input.observedMarkerTwo - (input.cellBMarkerTwo + cellAFraction * db);
  const residualSquared = r1 * r1 + r2 * r2;
  return {
    cellAFraction,
    cellBFraction,
    residualSquared: residualSquared < 1e-24 ? 0 : residualSquared,
  };
};

export const exampleInput = {
  observedMarkerOne: 0.7,
  observedMarkerTwo: 0.3,
  cellAMarkerOne: 1,
  cellAMarkerTwo: 0,
  cellBMarkerOne: 0,
  cellBMarkerTwo: 1,
} satisfies Input;
export const exampleOutput = {
  cellAFraction: 0.7,
  cellBFraction: 0.30000000000000004,
  residualSquared: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  id: "epigenetics/cell-mixture-deconvolution",
  title: "Cell Mixture Deconvolution",
  description:
    "Estimate a two-cell mixture fraction by constrained least squares against caller references.",
  inputs: [
    { id: "observedMarkerOne", kind: "number", label: "Observed marker one" },
    { id: "observedMarkerTwo", kind: "number", label: "Observed marker two" },
    { id: "cellAMarkerOne", kind: "number", label: "Cell a marker one" },
    { id: "cellAMarkerTwo", kind: "number", label: "Cell a marker two" },
    { id: "cellBMarkerOne", kind: "number", label: "Cell b marker one" },
    { id: "cellBMarkerTwo", kind: "number", label: "Cell b marker two" },
  ],
  outputs: [
    { id: "cellAFraction", kind: "number", label: "Cell a fraction" },
    { id: "cellBFraction", kind: "number", label: "Cell b fraction" },
    { id: "residualSquared", kind: "number", label: "Residual squared" },
  ],
  calculate: (value) =>
    calculate({
      observedMarkerOne: value.observedMarkerOne as number,
      observedMarkerTwo: value.observedMarkerTwo as number,
      cellAMarkerOne: value.cellAMarkerOne as number,
      cellAMarkerTwo: value.cellAMarkerTwo as number,
      cellBMarkerOne: value.cellBMarkerOne as number,
      cellBMarkerTwo: value.cellBMarkerTwo as number,
    }),
});
export const run = tool.execute;
export default tool;
