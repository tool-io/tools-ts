import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { rad, deg, wrap, skyVector, plateMatrix } from "../shared.js";

export type Input = Readonly<{
  readonly pixelX: number;
  readonly pixelY: number;
  readonly referencePixelX: number;
  readonly referencePixelY: number;
  readonly referenceRaDegrees: number;
  readonly referenceDecDegrees: number;
  readonly cdMatrix: readonly (readonly number[])[];
}>;
export type Output = Readonly<{
  readonly raDegrees: number;
  readonly decDegrees: number;
}>;
export const calculate = (input: Input): Output => {
  plateMatrix(input.cdMatrix);
  skyVector(input.referenceRaDegrees, input.referenceDecDegrees);
  const dx = input.pixelX - input.referencePixelX,
    dy = input.pixelY - input.referencePixelY,
    xi = rad(input.cdMatrix[0][0] * dx + input.cdMatrix[0][1] * dy),
    eta = rad(input.cdMatrix[1][0] * dx + input.cdMatrix[1][1] * dy),
    d = rad(input.referenceDecDegrees),
    den = Math.cos(d) - eta * Math.sin(d);
  return {
    raDegrees: wrap(input.referenceRaDegrees + deg(Math.atan2(xi, den))),
    decDegrees: deg(
      Math.atan2(Math.sin(d) + eta * Math.cos(d), Math.hypot(den, xi)),
    ),
  };
};
export const exampleInput = {
  pixelX: 10,
  pixelY: 20,
  referencePixelX: 10,
  referencePixelY: 20,
  referenceRaDegrees: 120,
  referenceDecDegrees: 30,
  cdMatrix: [
    [0.01, 0],
    [0, 0.01],
  ],
} satisfies Input;
export const exampleOutput = {
  raDegrees: 120,
  decDegrees: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/tan-wcs-pixel-to-sky",
  title: "Tan Wcs Pixel To Sky",
  description:
    "Apply inverse gnomonic TAN projection after a CD transform; pixel and reference-pixel values must use the same indexing convention, and SIP is not applied here.",
  inputs: [
    { id: "pixelX", label: "Pixel x", kind: "number" },
    { id: "pixelY", label: "Pixel y", kind: "number" },
    { id: "referencePixelX", label: "Reference pixel x", kind: "number" },
    { id: "referencePixelY", label: "Reference pixel y", kind: "number" },
    { id: "referenceRaDegrees", label: "Reference ra degrees", kind: "number" },
    {
      id: "referenceDecDegrees",
      label: "Reference dec degrees",
      kind: "number",
    },
    { id: "cdMatrix", label: "Cd matrix", kind: "matrix" },
  ],
  outputs: [
    { id: "raDegrees", label: "Ra degrees", kind: "number" },
    { id: "decDegrees", label: "Dec degrees", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      pixelX: value.pixelX as number,
      pixelY: value.pixelY as number,
      referencePixelX: value.referencePixelX as number,
      referencePixelY: value.referencePixelY as number,
      referenceRaDegrees: value.referenceRaDegrees as number,
      referenceDecDegrees: value.referenceDecDegrees as number,
      cdMatrix: value.cdMatrix as readonly (readonly number[])[],
    }),
});
export const run = tool.execute;
export default tool;
