import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../batch58-shared.js";
export type Input = Readonly<{
  semiMajorMeters: number;
  flattening: number;
  latitudeDegrees: number;
  pole: string;
  poleScale: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "semiMajorMeters",
    label: "Semi major meters",
    kind: "number",
    unit: "m",
  },
  { id: "flattening", label: "Flattening", kind: "number" },
  {
    id: "latitudeDegrees",
    label: "Latitude degrees",
    kind: "number",
    unit: "deg",
  },
  { id: "pole", label: "Pole", kind: "string" },
  { id: "poleScale", label: "Pole scale", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  const p = H.ellipsoid(i.semiMajorMeters, i.flattening);
  const phi = H.latitude(i.latitudeDegrees);
  H.check(
    ["north", "south"].includes(i.pole) &&
      i.poleScale > 0 &&
      i.poleScale <= 2 &&
      (i.pole === "north" ? i.latitudeDegrees >= 0 : i.latitudeDegrees <= 0),
  );
  const u = Math.abs(phi),
    m = Math.cos(u) / Math.sqrt(1 - p.e2 * Math.sin(u) ** 2),
    C = Math.sqrt((1 + p.e) ** (1 + p.e) * (1 - p.e) ** (1 - p.e)),
    k =
      Math.abs(i.latitudeDegrees) === 90
        ? i.poleScale
        : (2 * i.poleScale * Math.exp(-H.isometric(p.f, u))) / (C * m);
  return H.finish({
    pointScale: k,
    atPole: Math.abs(i.latitudeDegrees) === 90,
  });
};
export const example = {
  input: {
    semiMajorMeters: 10,
    flattening: 0,
    latitudeDegrees: 90,
    pole: "north",
    poleScale: 1,
  },
  output: { result: { pointScale: 1, atPole: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geodesy/stereographic-polar-scale-checker",
  title: "Stereographic Polar Aspect Scale True-at-Pole Checker",
  description:
    "Compute ellipsoidal polar-stereographic point scale normalized to an explicit pole scale, with analytic pole limit and same-hemisphere input; no polar coordinate inverse or geoid model.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit geodesy result; see field names for units",
      kind: "object",
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
