import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly mixedLayerCapeJKg: number;
  readonly effectiveHelicityM2S2: number;
  readonly effectiveBulkShearMS: number;
  readonly mixedLayerLclM: number;
  readonly signedMixedLayerCinJKg: number;
}>;
export type Output = Readonly<{ readonly effectiveStpCin: number }>;
const inputFields = [
  { id: "mixedLayerCapeJKg", label: "Mixed layer cape j kg", kind: "number" },
  {
    id: "effectiveHelicityM2S2",
    label: "Effective helicity m2 s2",
    kind: "number",
  },
  {
    id: "effectiveBulkShearMS",
    label: "Effective bulk shear m s",
    kind: "number",
  },
  { id: "mixedLayerLclM", label: "Mixed layer lcl m", kind: "number" },
  {
    id: "signedMixedLayerCinJKg",
    label: "Signed mixed layer cin j kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.mixedLayerCapeJKg, "mixedLayerCapeJKg");
  nonnegative(input.effectiveHelicityM2S2, "effectiveHelicityM2S2");
  nonnegative(input.effectiveBulkShearMS, "effectiveBulkShearMS");
  nonnegative(input.mixedLayerLclM, "mixedLayerLclM");
  if (input.signedMixedLayerCinJKg > 0)
    simpleError("CIN", "Signed nonpositive CIN.");
  const s = input.effectiveBulkShearMS,
    sh = s < 12.5 ? 0 : Math.min(s / 20, 1.5),
    l = Math.max(0, Math.min(1, (2000 - input.mixedLayerLclM) / 1000)),
    c = Math.max(0, Math.min(1, (200 + input.signedMixedLayerCinJKg) / 150));
  return {
    effectiveStpCin:
      (((input.mixedLayerCapeJKg / 1500) * input.effectiveHelicityM2S2) / 150) *
      sh *
      l *
      c,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  mixedLayerCapeJKg: 1500,
  effectiveHelicityM2S2: 150,
  effectiveBulkShearMS: 20,
  mixedLayerLclM: 1500,
  signedMixedLayerCinJKg: -50,
} satisfies Input;
export const exampleOutput = { effectiveStpCin: 0.5 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/significant-tornado-parameter-stp",
  title: "Significant Tornado Parameter STP Calculator",
  description:
    "Explicit effective-layer CIN-bearing STP normalization1500/150/20 with shear 12.5cutoff/cap 1.5, LCL1000–2000 and CIN−50..−200factors; not fixed-layer variant or forecast. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    { id: "effectiveStpCin", label: "Effective stp cin", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      mixedLayerCapeJKg: value.mixedLayerCapeJKg as number,
      effectiveHelicityM2S2: value.effectiveHelicityM2S2 as number,
      effectiveBulkShearMS: value.effectiveBulkShearMS as number,
      mixedLayerLclM: value.mixedLayerLclM as number,
      signedMixedLayerCinJKg: value.signedMixedLayerCinJKg as number,
    }),
});
export const run = tool.execute;
export default tool;
