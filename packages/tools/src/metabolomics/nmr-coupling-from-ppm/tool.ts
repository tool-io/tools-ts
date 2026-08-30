import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly splittingPpm: number;
  readonly spectrometerMhz: number;
}>;
export type Output = Readonly<{
  readonly couplingHz: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.splittingPpm < 0 || input.spectrometerMhz <= 0)
    simpleError(
      "splittingPpm",
      "Nonnegative ppm splitting and positive spectrometer frequency required.",
    );
  return { couplingHz: input.splittingPpm * input.spectrometerMhz };
};
export const exampleInput = {
  splittingPpm: 0.02,
  spectrometerMhz: 500,
} satisfies Input;
export const exampleOutput = { couplingHz: 10 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/nmr-coupling-from-ppm",
  title: "NMR Coupling From PPM",
  description:
    "Convert NMR peak separation in ppm to J-coupling hertz at a field frequency.",
  inputs: [
    { id: "splittingPpm", kind: "number", label: "Splitting ppm" },
    { id: "spectrometerMhz", kind: "number", label: "Spectrometer mhz" },
  ],
  outputs: [{ id: "couplingHz", kind: "number", label: "Coupling hz" }],
  calculate: (value) =>
    calculate({
      splittingPpm: value.splittingPpm as number,
      spectrometerMhz: value.spectrometerMhz as number,
    }),
});
export const run = tool.execute;
export default tool;
