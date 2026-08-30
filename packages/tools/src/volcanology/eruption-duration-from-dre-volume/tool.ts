import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../shared.js";
export type Input = Readonly<{
  readonly denseRockEquivalentVolumeM3: number;
  readonly denseRockDensityKgPerM3: number;
  readonly activeMassFluxKgPerSecond: number;
  readonly activeDutyFraction: number;
}>;
export type Output = Readonly<{
  readonly requiredActiveEruptionSeconds: number;
  readonly elapsedScenarioSeconds: number;
}>;
const inputFields = [
  {
    id: "denseRockEquivalentVolumeM3",
    label: "Dense rock equivalent volume m3",
    kind: "number",
  },
  {
    id: "denseRockDensityKgPerM3",
    label: "Dense rock density kg per m3",
    kind: "number",
  },
  {
    id: "activeMassFluxKgPerSecond",
    label: "Active mass flux kg per second",
    kind: "number",
  },
  { id: "activeDutyFraction", label: "Active duty fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.denseRockDensityKgPerM3, "denseRockDensityKgPerM3");
  positive(input.activeMassFluxKgPerSecond, "activeMassFluxKgPerSecond");
  positive(input.activeDutyFraction, "activeDutyFraction");
  nonnegative(input.denseRockEquivalentVolumeM3, "denseRockEquivalentVolumeM3");
  fraction(input.activeDutyFraction, "activeDutyFraction");
  const requiredActiveEruptionSeconds =
    (input.denseRockEquivalentVolumeM3 * input.denseRockDensityKgPerM3) /
    input.activeMassFluxKgPerSecond;
  return {
    requiredActiveEruptionSeconds,
    elapsedScenarioSeconds:
      requiredActiveEruptionSeconds / input.activeDutyFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  denseRockEquivalentVolumeM3: 100,
  denseRockDensityKgPerM3: 10,
  activeMassFluxKgPerSecond: 100,
  activeDutyFraction: 0.5,
} satisfies Input;
export const exampleOutput = {
  requiredActiveEruptionSeconds: 10,
  elapsedScenarioSeconds: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/eruption-duration-from-dre-volume",
  title: "Eruption Duration From DRE Volume",
  description:
    "Infer active and elapsed eruption duration from target DRE mass and caller active-rate/duty assumptions; not a next-eruption forecast or duration inferred from column height alone.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredActiveEruptionSeconds",
      label: "Required active eruption seconds",
      kind: "number",
    },
    {
      id: "elapsedScenarioSeconds",
      label: "Elapsed scenario seconds",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      denseRockEquivalentVolumeM3: value.denseRockEquivalentVolumeM3 as number,
      denseRockDensityKgPerM3: value.denseRockDensityKgPerM3 as number,
      activeMassFluxKgPerSecond: value.activeMassFluxKgPerSecond as number,
      activeDutyFraction: value.activeDutyFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
