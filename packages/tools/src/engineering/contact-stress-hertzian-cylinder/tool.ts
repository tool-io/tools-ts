import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch38-shared.js";
export type Input = Readonly<{
  readonly normalForceN: number;
  readonly contactLengthM: number;
  readonly effectiveRadiusM: number;
  readonly effectiveElasticModulusPa: number;
}>;
export type Output = Readonly<{
  readonly hertzLineHalfWidthM: number;
  readonly hertzLinePeakPressurePa: number;
}>;
const inputFields = [
  { id: "normalForceN", label: "Normal force n", kind: "number" },
  { id: "contactLengthM", label: "Contact length m", kind: "number" },
  { id: "effectiveRadiusM", label: "Effective radius m", kind: "number" },
  {
    id: "effectiveElasticModulusPa",
    label: "Effective elastic modulus pa",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.contactLengthM, "contactLengthM");
  positive(input.effectiveRadiusM, "effectiveRadiusM");
  positive(input.effectiveElasticModulusPa, "effectiveElasticModulusPa");
  nonnegative(input.normalForceN, "normalForceN");
  const line = input.normalForceN / input.contactLengthM;
  if (line === 0) return { hertzLineHalfWidthM: 0, hertzLinePeakPressurePa: 0 };
  const b = Math.sqrt(
    (4 * line * input.effectiveRadiusM) /
      (Math.PI * input.effectiveElasticModulusPa),
  );
  positive(b, "resolved contact half width");
  return {
    hertzLineHalfWidthM: b,
    hertzLinePeakPressurePa: (2 * line) / (Math.PI * b),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  normalForceN: 10,
  contactLengthM: 2,
  effectiveRadiusM: 0.5,
  effectiveElasticModulusPa: 100,
} satisfies Input;
export const exampleOutput = {
  hertzLineHalfWidthM: 0.1784124116152771,
  hertzLinePeakPressurePa: 17.841241161527716,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/contact-stress-hertzian-cylinder",
  title: "Hertzian Cylinder Contact Stress Calculator",
  description:
    "Ideal Hertz line contact b=√(4W′R′/πE′), p0=2W′/(πb), independently verified effective radii/modulus convention. Caller independently establishes units, regime, calibration and applicability; this does not establish design-code compliance, authenticity, operational safety, treatment efficacy or a validated forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "hertzLineHalfWidthM",
      label: "Hertz line half width m",
      kind: "number",
    },
    {
      id: "hertzLinePeakPressurePa",
      label: "Hertz line peak pressure pa",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      normalForceN: value.normalForceN as number,
      contactLengthM: value.contactLengthM as number,
      effectiveRadiusM: value.effectiveRadiusM as number,
      effectiveElasticModulusPa: value.effectiveElasticModulusPa as number,
    }),
});
export const run = tool.execute;
export default tool;
