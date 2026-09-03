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
} from "../batch40-shared.js";
export type Input = Readonly<{
  readonly observedPanInternalRadiusCm: number;
  readonly observedUsableFillHeightCm: number;
  readonly observedCentralTubeRadiusCm: number;
}>;
export type Output = Readonly<{ readonly usableRoundPanVolumeCM3: number }>;
const inputFields = [
  {
    id: "observedPanInternalRadiusCm",
    label: "Observed pan internal radius cm",
    kind: "number",
  },
  {
    id: "observedUsableFillHeightCm",
    label: "Observed usable fill height cm",
    kind: "number",
  },
  {
    id: "observedCentralTubeRadiusCm",
    label: "Observed central tube radius cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedPanInternalRadiusCm, "observedPanInternalRadiusCm");
  nonnegative(input.observedUsableFillHeightCm, "observedUsableFillHeightCm");
  nonnegative(input.observedCentralTubeRadiusCm, "observedCentralTubeRadiusCm");
  if (input.observedCentralTubeRadiusCm >= input.observedPanInternalRadiusCm)
    simpleError("radii", "Central tube strictly smaller than pan radius.");
  return {
    usableRoundPanVolumeCM3:
      Math.PI *
      (input.observedPanInternalRadiusCm ** 2 -
        input.observedCentralTubeRadiusCm ** 2) *
      input.observedUsableFillHeightCm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPanInternalRadiusCm: 10,
  observedUsableFillHeightCm: 4,
  observedCentralTubeRadiusCm: 2,
} satisfies Input;
export const exampleOutput = {
  usableRoundPanVolumeCM3: 1206.3715789784806,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cooking/cake-pan-volume",
  title: "Cooking Cake Pan Volume Calculator",
  description:
    "Internal straight-sided round/tube cake-pan usable fill volume, not external nominal pan diameter or brim capacity. Caller establishes matching ingredient basis and method. Not food-safety, doneness, preservation or allergy certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "usableRoundPanVolumeCM3",
      label: "Usable round pan volume c m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPanInternalRadiusCm: value.observedPanInternalRadiusCm as number,
      observedUsableFillHeightCm: value.observedUsableFillHeightCm as number,
      observedCentralTubeRadiusCm: value.observedCentralTubeRadiusCm as number,
    }),
});
export const run = tool.execute;
export default tool;
