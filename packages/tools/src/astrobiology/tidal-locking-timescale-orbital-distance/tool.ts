import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly initialSpinRadS: number;
  readonly semimajorMeters: number;
  readonly inertiaKgM2: number;
  readonly dissipationQ: number;
  readonly primaryMassKg: number;
  readonly loveNumber: number;
  readonly radiusMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "initialSpinRadS", label: "Initial spin rad s", kind: "number" },
  { id: "semimajorMeters", label: "Semimajor meters", kind: "number" },
  { id: "inertiaKgM2", label: "Inertia kg m2", kind: "number" },
  { id: "dissipationQ", label: "Dissipation q", kind: "number" },
  { id: "primaryMassKg", label: "Primary mass kg", kind: "number" },
  { id: "loveNumber", label: "Love number", kind: "number" },
  { id: "radiusMeters", label: "Radius meters", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  [
    i.initialSpinRadS,
    i.semimajorMeters,
    i.inertiaKgM2,
    i.dissipationQ,
    i.primaryMassKg,
    i.loveNumber,
    i.radiusMeters,
  ].forEach((v) => positive(v, "parameter"));
  return {
    approximateLockingSeconds:
      (i.initialSpinRadS *
        i.semimajorMeters ** 6 *
        i.inertiaKgM2 *
        i.dissipationQ) /
      (3 *
        6.6743e-11 *
        i.primaryMassKg ** 2 *
        i.loveNumber *
        i.radiusMeters ** 5),
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: {
    initialSpinRadS: 1,
    semimajorMeters: 2,
    inertiaKgM2: 3,
    dissipationQ: 4,
    primaryMassKg: 5,
    loveNumber: 0.5,
    radiusMeters: 1,
  },
  output: { result: { approximateLockingSeconds: 306848658286.26227 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/tidal-locking-timescale-orbital-distance",
  title: "Tidal Locking Timescale Orbital Distance Calculator",
  description:
    "Constant-Q circular-orbit approximate spin-locking time in seconds; fixed inertia, radius/Q/k2 and nonzero initial spin, no coupled tidal evolution.",
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
