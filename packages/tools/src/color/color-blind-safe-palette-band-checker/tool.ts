import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  rgbRows,
  oklab,
  simulate,
  nonnegative,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly paletteRgbRows: readonly (readonly number[])[];
  readonly callerMinimumSimulatedOklabDistance: number;
}>;
export type Output = Readonly<{
  readonly minimumProtanDeutanTritanDistances: readonly number[];
  readonly belowCallerDistancePolicyFlags: readonly number[];
}>;
const inputFields = [
  { id: "paletteRgbRows", label: "Palette rgb rows", kind: "matrix" },
  {
    id: "callerMinimumSimulatedOklabDistance",
    label: "Caller minimum simulated oklab distance",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(
    input.callerMinimumSimulatedOklabDistance,
    "callerMinimumSimulatedOklabDistance",
  );
  rgbRows(input.paletteRgbRows);
  if (input.paletteRgbRows.length < 2)
    simpleError("palette", "At least two colors required.");
  const types = ["protan", "deutan", "tritan"] as const;
  const minima = types.map((t) => {
    const labs = input.paletteRgbRows.map((c) =>
      oklab(simulate(c, t).simulatedRgb),
    );
    let best = Infinity;
    for (let i = 0; i < labs.length; i++)
      for (let j = i + 1; j < labs.length; j++)
        best = Math.min(
          best,
          Math.hypot(...labs[i].map((v, k) => v - labs[j][k])),
        );
    return best;
  });
  return {
    minimumProtanDeutanTritanDistances: minima,
    belowCallerDistancePolicyFlags: minima.map((v) =>
      v < input.callerMinimumSimulatedOklabDistance ? 1 : 0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  paletteRgbRows: [
    [0, 0, 0],
    [1, 1, 1],
  ],
  callerMinimumSimulatedOklabDistance: 0.1,
} satisfies Input;
export const exampleOutput = {
  minimumProtanDeutanTritanDistances: [
    0.9999999934735468, 0.9999997761596606, 0.9999999934735468,
  ],
  belowCallerDistancePolicyFlags: [0, 0, 0],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "color/color-blind-safe-palette-band-checker",
  title: "Color-Blind Safe Palette Band Check",
  description:
    "Audit all palette pairs in OKLab after three explicit dichromacy model simulations against caller distance threshold; this model screen is not a color-blind-safe guarantee, luminance contrast test or individual visual diagnosis.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumProtanDeutanTritanDistances",
      label: "Minimum protan deutan tritan distances",
      kind: "numberList",
    },
    {
      id: "belowCallerDistancePolicyFlags",
      label: "Below caller distance policy flags",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      paletteRgbRows: value.paletteRgbRows as readonly (readonly number[])[],
      callerMinimumSimulatedOklabDistance:
        value.callerMinimumSimulatedOklabDistance as number,
    }),
});
export const run = tool.execute;
export default tool;
