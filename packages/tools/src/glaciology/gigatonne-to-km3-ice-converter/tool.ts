import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly iceMassGigatonnes: number;
  readonly callerIceDensityKgM3: number;
}>;
export type Output = Readonly<{ readonly iceVolumeKm3: number }>;
const inputFields = [
  { id: "iceMassGigatonnes", label: "Ice mass gigatonnes", kind: "number" },
  {
    id: "callerIceDensityKgM3",
    label: "Caller ice density kg m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerIceDensityKgM3, "callerIceDensityKgM3");
  return {
    iceVolumeKm3: input.iceMassGigatonnes * (1000 / input.callerIceDensityKgM3),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  iceMassGigatonnes: 1,
  callerIceDensityKgM3: 1000,
} satisfies Input;
export const exampleOutput = { iceVolumeKm3: 1 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/gigatonne-to-km3-ice-converter",
  title: "Gigatonne to KM3 Ice Converter",
  description:
    "Convert signed ice mass gigatonnes to km³ with explicit caller density; 1 Gt=1e12 kg, 1 km³=1e9 m³; no sea-level prediction.",
  inputs: inputFields,
  outputs: [{ id: "iceVolumeKm3", label: "Ice volume km3", kind: "number" }],
  calculate: (value) =>
    calculate({
      iceMassGigatonnes: value.iceMassGigatonnes as number,
      callerIceDensityKgM3: value.callerIceDensityKgM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
