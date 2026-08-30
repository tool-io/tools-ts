import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly flamingZoneDepthM: number;
  readonly normalFrontSpreadMPerSecond: number;
  readonly observedFlamingDurationSeconds: number;
}>;
export type Output = Readonly<{
  readonly zoneTransitResidenceSeconds: number;
  readonly observedMinusModelResidenceSeconds: number;
}>;
const inputFields = [
  { id: "flamingZoneDepthM", label: "Flaming zone depth m", kind: "number" },
  {
    id: "normalFrontSpreadMPerSecond",
    label: "Normal front spread m per second",
    kind: "number",
  },
  {
    id: "observedFlamingDurationSeconds",
    label: "Observed flaming duration seconds",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.normalFrontSpreadMPerSecond, "normalFrontSpreadMPerSecond");
  nonnegative(input.flamingZoneDepthM, "flamingZoneDepthM");
  nonnegative(
    input.observedFlamingDurationSeconds,
    "observedFlamingDurationSeconds",
  );
  const zoneTransitResidenceSeconds =
    input.flamingZoneDepthM / input.normalFrontSpreadMPerSecond;
  return {
    zoneTransitResidenceSeconds,
    observedMinusModelResidenceSeconds:
      input.observedFlamingDurationSeconds - zoneTransitResidenceSeconds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  flamingZoneDepthM: 2,
  normalFrontSpreadMPerSecond: 0.5,
  observedFlamingDurationSeconds: 3,
} satisfies Input;
export const exampleOutput = {
  zoneTransitResidenceSeconds: 4,
  observedMinusModelResidenceSeconds: -1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/residence-time-flaming-combustion",
  title: "Flaming Combustion Residence Time",
  description:
    "Infer steady-front flaming residence from measured zone depth and normal front speed and compare observed duration; not ignition delay or a universal fuel burn time.",
  inputs: inputFields,
  outputs: [
    {
      id: "zoneTransitResidenceSeconds",
      label: "Zone transit residence seconds",
      kind: "number",
    },
    {
      id: "observedMinusModelResidenceSeconds",
      label: "Observed minus model residence seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      flamingZoneDepthM: value.flamingZoneDepthM as number,
      normalFrontSpreadMPerSecond: value.normalFrontSpreadMPerSecond as number,
      observedFlamingDurationSeconds:
        value.observedFlamingDurationSeconds as number,
    }),
});
export const run = tool.execute;
export default tool;
