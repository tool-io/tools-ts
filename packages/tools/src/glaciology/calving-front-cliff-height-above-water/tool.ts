import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly cliffTopElevationM: number;
  readonly waterSurfaceElevationM: number;
  readonly cliffToeElevationM: number;
}>;
export type Output = Readonly<{
  readonly observedAboveWaterCliffHeightM: number;
  readonly totalObservedCliffHeightM: number;
  readonly waterAboveCliffTop: boolean;
}>;
const inputFields = [
  { id: "cliffTopElevationM", label: "Cliff top elevation m", kind: "number" },
  {
    id: "waterSurfaceElevationM",
    label: "Water surface elevation m",
    kind: "number",
  },
  { id: "cliffToeElevationM", label: "Cliff toe elevation m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.cliffTopElevationM < input.cliffToeElevationM)
    simpleError(
      "geometry",
      "Top must be at or above toe in shared caller datum.",
    );
  return {
    observedAboveWaterCliffHeightM:
      input.cliffTopElevationM - input.waterSurfaceElevationM,
    totalObservedCliffHeightM:
      input.cliffTopElevationM - input.cliffToeElevationM,
    waterAboveCliffTop: input.waterSurfaceElevationM > input.cliffTopElevationM,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  cliffTopElevationM: 10,
  waterSurfaceElevationM: 2,
  cliffToeElevationM: -5,
} satisfies Input;
export const exampleOutput = {
  observedAboveWaterCliffHeightM: 8,
  totalObservedCliffHeightM: 15,
  waterAboveCliffTop: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/calving-front-cliff-height-above-water",
  title: "Calving Front Cliff Height Above Water Calculator",
  description:
    "Measure observed cliff top relative to water/toe in caller same vertical datum; signed submerged top retained, no flotation thickness inversion or datum transformation.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedAboveWaterCliffHeightM",
      label: "Observed above water cliff height m",
      kind: "number",
    },
    {
      id: "totalObservedCliffHeightM",
      label: "Total observed cliff height m",
      kind: "number",
    },
    {
      id: "waterAboveCliffTop",
      label: "Water above cliff top",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      cliffTopElevationM: value.cliffTopElevationM as number,
      waterSurfaceElevationM: value.waterSurfaceElevationM as number,
      cliffToeElevationM: value.cliffToeElevationM as number,
    }),
});
export const run = tool.execute;
export default tool;
