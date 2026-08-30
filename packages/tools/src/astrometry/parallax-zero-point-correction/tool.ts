import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { aligned } from "../shared.js";

export type Input = Readonly<{
  readonly measuredParallaxesMas: readonly number[];
  readonly zeroPointsMas: readonly number[];
}>;
export type Output = Readonly<{
  readonly correctedParallaxesMas: readonly number[];
  readonly nonpositiveIndexes: readonly number[];
}>;
export const calculate = (input: Input): Output => {
  aligned(
    input.measuredParallaxesMas,
    input.zeroPointsMas,
    "measuredParallaxesMas",
  );
  const correctedParallaxesMas = input.measuredParallaxesMas.map(
    (v, i) => v - input.zeroPointsMas[i],
  );
  return {
    correctedParallaxesMas,
    nonpositiveIndexes: correctedParallaxesMas.flatMap((v, i) =>
      v <= 0 ? [i] : [],
    ),
  };
};
export const exampleInput = {
  measuredParallaxesMas: [1, 0],
  zeroPointsMas: [-0.1, 0.1],
} satisfies Input;
export const exampleOutput = {
  correctedParallaxesMas: [1.1, -0.1],
  nonpositiveIndexes: [1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/parallax-zero-point-correction",
  title: "Parallax Zero Point Correction",
  description:
    "Subtract caller-provided source-specific astrometric parallax zero points, preserving nonpositive results rather than inverting them to distances.",
  inputs: [
    {
      id: "measuredParallaxesMas",
      label: "Measured parallaxes mas",
      kind: "numberList",
    },
    { id: "zeroPointsMas", label: "Zero points mas", kind: "numberList" },
  ],
  outputs: [
    {
      id: "correctedParallaxesMas",
      label: "Corrected parallaxes mas",
      kind: "numberList",
    },
    {
      id: "nonpositiveIndexes",
      label: "Nonpositive indexes",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredParallaxesMas: value.measuredParallaxesMas as readonly number[],
      zeroPointsMas: value.zeroPointsMas as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
