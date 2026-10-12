import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly surfaceTemperatureK: number;
  readonly pressureAdjustedMeltK: number;
  readonly iceConductivityWPerMK: number;
  readonly radiogenicFluxWPerM2: number;
  readonly tidalFluxWPerM2: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "surfaceTemperatureK", label: "Surface temperature k", kind: "number" },
  {
    id: "pressureAdjustedMeltK",
    label: "Pressure adjusted melt k",
    kind: "number",
  },
  {
    id: "iceConductivityWPerMK",
    label: "Ice conductivity w per m k",
    kind: "number",
  },
  {
    id: "radiogenicFluxWPerM2",
    label: "Radiogenic flux w per m2",
    kind: "number",
  },
  { id: "tidalFluxWPerM2", label: "Tidal flux w per m2", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.surfaceTemperatureK, "surface");
  positive(i.pressureAdjustedMeltK, "melt");
  positive(i.iceConductivityWPerMK, "conductivity");
  nonnegative(i.radiogenicFluxWPerM2, "radiogenic");
  nonnegative(i.tidalFluxWPerM2, "tidal");
  positive(i.radiogenicFluxWPerM2 + i.tidalFluxWPerM2, "heat flux");
  if (i.pressureAdjustedMeltK <= i.surfaceTemperatureK)
    simpleError("temperature", "Melt must exceed surface.");
  return {
    conductiveThicknessMeters:
      (i.iceConductivityWPerMK *
        (i.pressureAdjustedMeltK - i.surfaceTemperatureK)) /
      (i.radiogenicFluxWPerM2 + i.tidalFluxWPerM2),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    surfaceTemperatureK: 100,
    pressureAdjustedMeltK: 200,
    iceConductivityWPerMK: 2,
    radiogenicFluxWPerM2: 0.1,
    tidalFluxWPerM2: 0.1,
  },
  output: { result: { conductiveThicknessMeters: 1000 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/subsurface-ocean-ice-shell-thickness",
  title:
    "Subsurface Ocean Ice Shell Thickness Gravity-Tidal Estimate Calculator",
  description:
    "Steady planar conductive ice thickness with constant conductivity and independently established gravity/pressure-adjusted melt temperature and heat flux; no pressure/tidal source solver.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { conductiveThicknessMeters: { type: "number" } },
        required: ["conductiveThicknessMeters"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
