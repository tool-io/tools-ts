import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly ringDikeIntrusionVolumeM3: number;
  readonly innerRingRadiusM: number;
  readonly intrusionVerticalExtentM: number;
}>;
export type Output = Readonly<{
  readonly inferredRadialDikeThicknessM: number;
}>;
const inputFields = [
  {
    id: "ringDikeIntrusionVolumeM3",
    label: "Ring dike intrusion volume m3",
    kind: "number",
  },
  { id: "innerRingRadiusM", label: "Inner ring radius m", kind: "number" },
  {
    id: "intrusionVerticalExtentM",
    label: "Intrusion vertical extent m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.intrusionVerticalExtentM, "intrusionVerticalExtentM");
  nonnegative(input.ringDikeIntrusionVolumeM3, "ringDikeIntrusionVolumeM3");
  nonnegative(input.innerRingRadiusM, "innerRingRadiusM");
  const area =
      input.ringDikeIntrusionVolumeM3 /
      (Math.PI * input.intrusionVerticalExtentM),
    r = input.innerRingRadiusM;
  return {
    inferredRadialDikeThicknessM:
      area === 0 ? 0 : area / (Math.hypot(r, Math.sqrt(area)) + r),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  ringDikeIntrusionVolumeM3: 659.7344572538566,
  innerRingRadiusM: 10,
  intrusionVerticalExtentM: 1,
} satisfies Input;
export const exampleOutput = {
  inferredRadialDikeThicknessM: 7.606816861659009,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/ring-dike-thickness-estimate",
  title: "Ring Dike Thickness Estimate",
  description:
    "Invert a full circular vertical ring-dike volume to radial thickness with a cancellation-safe annulus inversion; assumes uniform extent and complete ring, not a fault-stress estimate.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredRadialDikeThicknessM",
      label: "Inferred radial dike thickness m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      ringDikeIntrusionVolumeM3: value.ringDikeIntrusionVolumeM3 as number,
      innerRingRadiusM: value.innerRingRadiusM as number,
      intrusionVerticalExtentM: value.intrusionVerticalExtentM as number,
    }),
});
export const run = tool.execute;
export default tool;
