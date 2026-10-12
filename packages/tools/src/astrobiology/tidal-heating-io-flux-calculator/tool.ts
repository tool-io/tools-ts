import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
  angle,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly primaryMassKg: number;
  readonly radiusMeters: number;
  readonly semimajorMeters: number;
  readonly eccentricity: number;
  readonly loveNumber: number;
  readonly dissipationQ: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "primaryMassKg", label: "Primary mass kg", kind: "number" },
  { id: "radiusMeters", label: "Radius meters", kind: "number" },
  { id: "semimajorMeters", label: "Semimajor meters", kind: "number" },
  { id: "eccentricity", label: "Eccentricity", kind: "number" },
  { id: "loveNumber", label: "Love number", kind: "number" },
  { id: "dissipationQ", label: "Dissipation q", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  [
    i.primaryMassKg,
    i.radiusMeters,
    i.semimajorMeters,
    i.loveNumber,
    i.dissipationQ,
  ].forEach((v) => positive(v, "parameter"));
  angle(i.eccentricity, "e", 0, 0.1);
  if (i.radiusMeters >= i.semimajorMeters)
    simpleError("radius", "Body smaller than orbit.");
  return {
    approximateFluxWPerM2:
      ((((21 / 2) * i.loveNumber) / i.dissipationQ) *
        6.6743e-11 *
        i.primaryMassKg ** 2 *
        i.radiusMeters ** 3 *
        Math.sqrt((6.6743e-11 * i.primaryMassKg) / i.semimajorMeters ** 3) *
        i.eccentricity ** 2) /
      (4 * Math.PI * i.semimajorMeters ** 6),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    primaryMassKg: 1e20,
    radiusMeters: 100000.0,
    semimajorMeters: 10000000.0,
    eccentricity: 0.01,
    loveNumber: 0.1,
    dissipationQ: 100,
  },
  output: { result: { approximateFluxWPerM2: 1.4407479839246263e-10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/tidal-heating-io-flux-calculator",
  title: "Tidal Heating Io-Style Flux W/m2 Calculator",
  description:
    "Synchronous low-eccentricity constant-Q eccentricity tidal heating divided by surface area; no obliquity/resonance or thermal evolution.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { approximateFluxWPerM2: { type: "number" } },
        required: ["approximateFluxWPerM2"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
