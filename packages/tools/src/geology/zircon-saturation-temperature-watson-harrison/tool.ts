import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly zirconConcentrationPpm: number;
  readonly compositionM: number;
}>;
export type Output = Readonly<{ readonly watsonHarrisonTemperatureK: number }>;
const inputFields = [
  {
    id: "zirconConcentrationPpm",
    label: "Zircon concentration ppm",
    kind: "number",
  },
  { id: "compositionM", label: "Composition m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.zirconConcentrationPpm, "zirconConcentrationPpm");
  positive(input.compositionM, "compositionM");
  const d = 497644 / input.zirconConcentrationPpm,
    den = positive(
      Math.log(d) + 2.95 + 0.85 * (input.compositionM - 1),
      "thermometer denominator",
    );
  return { watsonHarrisonTemperatureK: 12900 / den };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  zirconConcentrationPpm: 497644,
  compositionM: 1,
} satisfies Input;
export const exampleOutput = {
  watsonHarrisonTemperatureK: 4372.881355932203,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/zircon-saturation-temperature-watson-harrison",
  title: "Geology Zircon Saturation Temperature Watson Harrison Calculator",
  description:
    "Watson–Harrison 1983 zircon saturation T=12900/(ln(497644/Zr)+2.95+.85(M−1)); M is independently calculated cation(Na+K+2Ca)/(AlSi), melt saturation/application externally verified. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "watsonHarrisonTemperatureK",
      label: "Watson harrison temperature k",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      zirconConcentrationPpm: value.zirconConcentrationPpm as number,
      compositionM: value.compositionM as number,
    }),
});
export const run = tool.execute;
export default tool;
