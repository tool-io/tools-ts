import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, seawaterDensity } from "../shared.js";
export type Input = Readonly<{
  readonly temperatureIpts68C: number;
  readonly practicalSalinity: number;
  readonly pressureDbar: number;
}>;
export type Output = Readonly<{ readonly densityKgPerM3: number }>;
const inputFields = [
  { id: "temperatureIpts68C", label: "Temperature ipts68 c", kind: "number" },
  { id: "practicalSalinity", label: "Practical salinity", kind: "number" },
  { id: "pressureDbar", label: "Pressure dbar", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    densityKgPerM3: seawaterDensity(
      input.temperatureIpts68C,
      input.practicalSalinity,
      input.pressureDbar,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  temperatureIpts68C: 0,
  practicalSalinity: 0,
  pressureDbar: 0,
} satisfies Input;
export const exampleOutput = { densityKgPerM3: 999.842594 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "oceanography/seawater-density-tsp",
  title: "Seawater Density TSP",
  description:
    "Compute UNESCO EOS-80 seawater density for 0–40 °C IPTS-68, practical salinity 0–42 and gauge pressure 0–10000 dbar; not TEOS-10 or potential density.",
  inputs: inputFields,
  outputs: [
    { id: "densityKgPerM3", label: "Density kg per m3", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      temperatureIpts68C: value.temperatureIpts68C as number,
      practicalSalinity: value.practicalSalinity as number,
      pressureDbar: value.pressureDbar as number,
    }),
});
export const run = tool.execute;
export default tool;
