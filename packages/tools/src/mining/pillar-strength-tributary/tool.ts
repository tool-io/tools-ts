import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly pillarWidthM: number;
  readonly pillarHeightM: number;
  readonly roomWidthM: number;
  readonly verticalStressMpa: number;
  readonly strengthCoefficientMpa: number;
  readonly widthExponent: number;
  readonly heightExponent: number;
}>;
export type Output = Readonly<{
  readonly empiricalPillarStrengthMpa: number;
  readonly tributaryPillarStressMpa: number;
  readonly capacityStressRatio: number;
}>;
const inputFields = [
  { id: "pillarWidthM", label: "Pillar width m", kind: "number" },
  { id: "pillarHeightM", label: "Pillar height m", kind: "number" },
  { id: "roomWidthM", label: "Room width m", kind: "number" },
  { id: "verticalStressMpa", label: "Vertical stress mpa", kind: "number" },
  {
    id: "strengthCoefficientMpa",
    label: "Strength coefficient mpa",
    kind: "number",
  },
  { id: "widthExponent", label: "Width exponent", kind: "number" },
  { id: "heightExponent", label: "Height exponent", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.pillarWidthM, "pillarWidthM");
  positive(input.pillarHeightM, "pillarHeightM");
  positive(input.verticalStressMpa, "verticalStressMpa");
  positive(input.strengthCoefficientMpa, "strengthCoefficientMpa");
  nonnegative(input.roomWidthM, "roomWidthM");
  nonnegative(input.widthExponent, "widthExponent");
  nonnegative(input.heightExponent, "heightExponent");
  const empiricalPillarStrengthMpa =
      (input.strengthCoefficientMpa *
        input.pillarWidthM ** input.widthExponent) /
      input.pillarHeightM ** input.heightExponent,
    tributaryPillarStressMpa =
      input.verticalStressMpa *
      ((input.pillarWidthM + input.roomWidthM) / input.pillarWidthM) ** 2;
  return {
    empiricalPillarStrengthMpa,
    tributaryPillarStressMpa,
    capacityStressRatio: empiricalPillarStrengthMpa / tributaryPillarStressMpa,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  pillarWidthM: 10,
  pillarHeightM: 5,
  roomWidthM: 10,
  verticalStressMpa: 2,
  strengthCoefficientMpa: 5,
  widthExponent: 0.5,
  heightExponent: 0.5,
} satisfies Input;
export const exampleOutput = {
  empiricalPillarStrengthMpa: 7.0710678118654755,
  tributaryPillarStressMpa: 8,
  capacityStressRatio: 0.8838834764831844,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/pillar-strength-tributary",
  title: "Tributary Pillar Strength",
  description:
    "Compare calibrated square-pillar empirical strength with tributary-area stress; coefficient assumes meter dimensions and stability certification is excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "empiricalPillarStrengthMpa",
      label: "Empirical pillar strength mpa",
      kind: "number",
    },
    {
      id: "tributaryPillarStressMpa",
      label: "Tributary pillar stress mpa",
      kind: "number",
    },
    {
      id: "capacityStressRatio",
      label: "Capacity stress ratio",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      pillarWidthM: value.pillarWidthM as number,
      pillarHeightM: value.pillarHeightM as number,
      roomWidthM: value.roomWidthM as number,
      verticalStressMpa: value.verticalStressMpa as number,
      strengthCoefficientMpa: value.strengthCoefficientMpa as number,
      widthExponent: value.widthExponent as number,
      heightExponent: value.heightExponent as number,
    }),
});
export const run = tool.execute;
export default tool;
