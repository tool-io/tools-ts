import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly planetMassKg: number;
  readonly starMassKg: number;
  readonly orbitSemimajorAu: number;
  readonly distanceParsecs: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "planetMassKg", label: "Planet mass kg", kind: "number" },
  { id: "starMassKg", label: "Star mass kg", kind: "number" },
  { id: "orbitSemimajorAu", label: "Orbit semimajor au", kind: "number" },
  { id: "distanceParsecs", label: "Distance parsecs", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  nonnegative(i.planetMassKg, "planet");
  positive(i.starMassKg, "star");
  positive(i.orbitSemimajorAu, "axis");
  positive(i.distanceParsecs, "distance");
  return {
    angularSemimajorMicroarcsec:
      (1e6 * i.orbitSemimajorAu * i.planetMassKg) /
      (i.starMassKg + i.planetMassKg) /
      i.distanceParsecs,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    planetMassKg: 1,
    starMassKg: 999,
    orbitSemimajorAu: 1,
    distanceParsecs: 10,
  },
  output: { result: { angularSemimajorMicroarcsec: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/astrometric-signature-microarcsec-calculator",
  title: "Astrometric Signature Microarcsecond Amplitude Calculator",
  description:
    "Small-angle stellar reflex semi-major angular signature using total two-body mass, not inclined apparent-orbit fit or detection certainty.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
