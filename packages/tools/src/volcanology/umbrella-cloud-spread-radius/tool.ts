import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly initialUmbrellaRadiusM: number;
  readonly intrusionVolumeFluxM3PerSecond: number;
  readonly elapsedSeconds: number;
  readonly umbrellaLayerThicknessM: number;
}>;
export type Output = Readonly<{
  readonly modelUmbrellaRadiusM: number;
  readonly addedCloudAreaM2: number;
}>;
const inputFields = [
  {
    id: "initialUmbrellaRadiusM",
    label: "Initial umbrella radius m",
    kind: "number",
  },
  {
    id: "intrusionVolumeFluxM3PerSecond",
    label: "Intrusion volume flux m3 per second",
    kind: "number",
  },
  { id: "elapsedSeconds", label: "Elapsed seconds", kind: "number" },
  {
    id: "umbrellaLayerThicknessM",
    label: "Umbrella layer thickness m",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.umbrellaLayerThicknessM, "umbrellaLayerThicknessM");
  nonnegative(input.initialUmbrellaRadiusM, "initialUmbrellaRadiusM");
  nonnegative(
    input.intrusionVolumeFluxM3PerSecond,
    "intrusionVolumeFluxM3PerSecond",
  );
  nonnegative(input.elapsedSeconds, "elapsedSeconds");
  const addedCloudAreaM2 =
    (input.intrusionVolumeFluxM3PerSecond * input.elapsedSeconds) /
    input.umbrellaLayerThicknessM;
  return {
    modelUmbrellaRadiusM: Math.sqrt(
      input.initialUmbrellaRadiusM ** 2 + addedCloudAreaM2 / Math.PI,
    ),
    addedCloudAreaM2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialUmbrellaRadiusM: 10,
  intrusionVolumeFluxM3PerSecond: 3.141592653589793,
  elapsedSeconds: 100,
  umbrellaLayerThicknessM: 1,
} satisfies Input;
export const exampleOutput = {
  modelUmbrellaRadiusM: 14.142135623730951,
  addedCloudAreaM2: 314.1592653589793,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/umbrella-cloud-spread-radius",
  title: "Umbrella Cloud Spread Radius",
  description:
    "Balance uniform-thickness axisymmetric umbrella intrusion volume into radius, excluding wind shear, entrainment and sedimentation; not a mapped ash footprint or aviation warning.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelUmbrellaRadiusM",
      label: "Model umbrella radius m",
      kind: "number",
    },
    { id: "addedCloudAreaM2", label: "Added cloud area m2", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      initialUmbrellaRadiusM: value.initialUmbrellaRadiusM as number,
      intrusionVolumeFluxM3PerSecond:
        value.intrusionVolumeFluxM3PerSecond as number,
      elapsedSeconds: value.elapsedSeconds as number,
      umbrellaLayerThicknessM: value.umbrellaLayerThicknessM as number,
    }),
});
export const run = tool.execute;
export default tool;
