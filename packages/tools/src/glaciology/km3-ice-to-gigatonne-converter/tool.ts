import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly iceVolumeKm3: number;
  readonly callerIceDensityKgM3: number;
}>;
export type Output = Readonly<{ readonly iceMassGigatonnes: number }>;
const inputFields = [
  { id: "iceVolumeKm3", label: "Ice volume km3", kind: "number" },
  {
    id: "callerIceDensityKgM3",
    label: "Caller ice density kg m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerIceDensityKgM3, "callerIceDensityKgM3");
  return {
    iceMassGigatonnes: input.iceVolumeKm3 * (input.callerIceDensityKgM3 / 1000),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  iceVolumeKm3: 1,
  callerIceDensityKgM3: 900,
} satisfies Input;
export const exampleOutput = { iceMassGigatonnes: 0.9 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/km3-ice-to-gigatonne-converter",
  title: "KM3 Ice to Gigatonne Converter",
  description:
    "Convert signed ice volume km³ to gigatonnes using explicit caller density; inverse input operation, not a sea-level equivalent or default-density unit conversion.",
  inputs: inputFields,
  outputs: [
    { id: "iceMassGigatonnes", label: "Ice mass gigatonnes", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      iceVolumeKm3: value.iceVolumeKm3 as number,
      callerIceDensityKgM3: value.callerIceDensityKgM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
