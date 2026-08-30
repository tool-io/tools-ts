import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  ordered,
} from "../shared.js";
export type Input = Readonly<{
  readonly rimInteriorDiameterCm: number;
  readonly profileRelativeHeights: readonly number[];
  readonly profileRelativeRadii: readonly number[];
}>;
export type Output = Readonly<{
  readonly reconstructedInteriorVolumeLiters: number;
}>;
const inputFields = [
  {
    id: "rimInteriorDiameterCm",
    label: "Rim interior diameter cm",
    kind: "number",
  },
  {
    id: "profileRelativeHeights",
    label: "Profile relative heights",
    kind: "numberList",
  },
  {
    id: "profileRelativeRadii",
    label: "Profile relative radii",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.rimInteriorDiameterCm, "rimInteriorDiameterCm");
  input.profileRelativeHeights.forEach((v) =>
    nonnegative(v, "profileRelativeHeights"),
  );
  input.profileRelativeRadii.forEach((v) =>
    nonnegative(v, "profileRelativeRadii"),
  );
  aligned(
    input.profileRelativeHeights,
    input.profileRelativeRadii,
    "profileRelativeHeights",
  );
  ordered(input.profileRelativeHeights, "profileRelativeHeights");
  if (
    input.profileRelativeHeights[0] !== 0 ||
    input.profileRelativeRadii.at(-1) !== 0.5
  )
    simpleError(
      "profile",
      "Profile begins at base height zero and terminates at relative rim radius 0.5; coordinates normalized to rim diameter.",
    );
  const d = input.rimInteriorDiameterCm;
  let v = 0;
  for (let i = 1; i < input.profileRelativeHeights.length; i++) {
    const a = input.profileRelativeRadii[i - 1] * d,
      b = input.profileRelativeRadii[i] * d,
      h =
        (input.profileRelativeHeights[i] -
          input.profileRelativeHeights[i - 1]) *
        d;
    v += (Math.PI * h * (a * a + a * b + b * b)) / 3;
  }
  return { reconstructedInteriorVolumeLiters: v / 1000 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rimInteriorDiameterCm: 10,
  profileRelativeHeights: [0, 1, 2],
  profileRelativeRadii: [0, 0.5, 0.5],
} satisfies Input;
export const exampleOutput = {
  reconstructedInteriorVolumeLiters: 1.0471975511965976,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/vessel-volume-from-rim-diameter",
  title: "Vessel Volume From Rim Diameter",
  description:
    "Reconstruct piecewise conical-frustum interior volume from a supplied normalized vessel profile scaled by measured interior rim diameter; no universal rim-only vessel shape assumed.",
  inputs: inputFields,
  outputs: [
    {
      id: "reconstructedInteriorVolumeLiters",
      label: "Reconstructed interior volume liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      rimInteriorDiameterCm: value.rimInteriorDiameterCm as number,
      profileRelativeHeights: value.profileRelativeHeights as readonly number[],
      profileRelativeRadii: value.profileRelativeRadii as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
