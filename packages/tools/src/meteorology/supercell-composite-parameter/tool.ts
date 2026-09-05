import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly mostUnstableCapeJKg: number;
  readonly effectiveStormRelativeHelicityM2S2: number;
  readonly effectiveBulkShearMS: number;
}>;
export type Output = Readonly<{
  readonly effectiveLayerSupercellComposite: number;
}>;
const inputFields = [
  {
    id: "mostUnstableCapeJKg",
    label: "Most unstable cape j kg",
    kind: "number",
  },
  {
    id: "effectiveStormRelativeHelicityM2S2",
    label: "Effective storm relative helicity m2 s2",
    kind: "number",
  },
  {
    id: "effectiveBulkShearMS",
    label: "Effective bulk shear m s",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.mostUnstableCapeJKg, "mostUnstableCapeJKg");
  nonnegative(
    input.effectiveStormRelativeHelicityM2S2,
    "effectiveStormRelativeHelicityM2S2",
  );
  nonnegative(input.effectiveBulkShearMS, "effectiveBulkShearMS");
  const s = input.effectiveBulkShearMS;
  return {
    effectiveLayerSupercellComposite:
      (((input.mostUnstableCapeJKg / 1000) *
        input.effectiveStormRelativeHelicityM2S2) /
        50) *
      (s < 10 ? 0 : Math.min(s, 20) / 20),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  mostUnstableCapeJKg: 1000,
  effectiveStormRelativeHelicityM2S2: 50,
  effectiveBulkShearMS: 15,
} satisfies Input;
export const exampleOutput = {
  effectiveLayerSupercellComposite: 0.75,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/supercell-composite-parameter",
  title: "Supercell Composite Parameter Calculator",
  description:
    "Named effective-layer SCP:MUCAPE/1000×ESRH/50×shearFactor(0below10m/s, min(s,20)/20); independently sounding-derived terms, no tornado occurrence/probability. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "effectiveLayerSupercellComposite",
      label: "Effective layer supercell composite",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      mostUnstableCapeJKg: value.mostUnstableCapeJKg as number,
      effectiveStormRelativeHelicityM2S2:
        value.effectiveStormRelativeHelicityM2S2 as number,
      effectiveBulkShearMS: value.effectiveBulkShearMS as number,
    }),
});
export const run = tool.execute;
export default tool;
