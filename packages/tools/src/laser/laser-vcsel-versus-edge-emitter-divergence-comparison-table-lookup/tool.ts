import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type VcselEdgeEmitterComparisonInput = {
  readonly distanceMm: number;
  readonly vcselFullAngleDeg: number;
  readonly edgeFastAxisDeg: number;
  readonly edgeSlowAxisDeg: number;
};

export type VcselEdgeEmitterComparisonOutput = {
  readonly spotVcselMm: number;
  readonly spotEdgeFastMm: number;
  readonly spotEdgeSlowMm: number;
  readonly astigmatismNote: string;
};

const spotDiameterMm = (distanceMm: number, fullAngleDeg: number): number =>
  2 * distanceMm * Math.tan((fullAngleDeg * Math.PI) / 360);

export const compareVcselVersusEdgeEmitter = (
  input: VcselEdgeEmitterComparisonInput,
): VcselEdgeEmitterComparisonOutput => {
  if (input.distanceMm < 0)
    simpleError("distanceMm", "Distance cannot be negative.");
  for (const [field, angle] of [
    ["vcselFullAngleDeg", input.vcselFullAngleDeg],
    ["edgeFastAxisDeg", input.edgeFastAxisDeg],
    ["edgeSlowAxisDeg", input.edgeSlowAxisDeg],
  ] as const)
    if (angle < 0 || angle >= 180)
      simpleError(
        field,
        "A full divergence angle must be at least zero and less than 180 degrees.",
      );
  return {
    spotVcselMm: spotDiameterMm(input.distanceMm, input.vcselFullAngleDeg),
    spotEdgeFastMm: spotDiameterMm(input.distanceMm, input.edgeFastAxisDeg),
    spotEdgeSlowMm: spotDiameterMm(input.distanceMm, input.edgeSlowAxisDeg),
    astigmatismNote:
      "Edge emitters are astigmatic — collimate the fast and slow axes with separate optics; VCSELs emit a single circular beam.",
  };
};

export const vcselEdgeEmitterComparisonExample = {
  input: {
    distanceMm: 100,
    vcselFullAngleDeg: 12,
    edgeFastAxisDeg: 40,
    edgeSlowAxisDeg: 10,
  },
  output: {
    spotVcselMm: 2 * 100 * Math.tan((12 * Math.PI) / 360),
    spotEdgeFastMm: 2 * 100 * Math.tan((40 * Math.PI) / 360),
    spotEdgeSlowMm: 2 * 100 * Math.tan((10 * Math.PI) / 360),
    astigmatismNote:
      "Edge emitters are astigmatic — collimate the fast and slow axes with separate optics; VCSELs emit a single circular beam.",
  },
} satisfies ToolExample<
  VcselEdgeEmitterComparisonInput,
  VcselEdgeEmitterComparisonOutput
>;

export const vcselEdgeEmitterComparisonTool = createSimpleTool({
  calculate: (input) =>
    compareVcselVersusEdgeEmitter({
      distanceMm: input.distanceMm as number,
      edgeFastAxisDeg: input.edgeFastAxisDeg as number,
      edgeSlowAxisDeg: input.edgeSlowAxisDeg as number,
      vcselFullAngleDeg: input.vcselFullAngleDeg as number,
    }),
  description:
    "Compare far-field spot diameters of a VCSEL and an edge emitter at a given working distance from their full-angle divergences.",
  id: "laser/laser-vcsel-versus-edge-emitter-divergence-comparison-table-lookup",
  inputs: [
    {
      default: 100,
      description: "Working distance to the target surface.",
      id: "distanceMm",
      kind: "number",
      label: "Distance",
      minimum: 0,
      unit: "mm",
    },
    {
      default: 12,
      description: "Typical circular full-angle divergence of a VCSEL.",
      id: "vcselFullAngleDeg",
      kind: "number",
      label: "VCSEL divergence",
      maximum: 179.999999,
      minimum: 0,
      unit: "°",
    },
    {
      default: 40,
      description: "Edge-emitter fast-axis full-angle divergence.",
      id: "edgeFastAxisDeg",
      kind: "number",
      label: "Fast axis",
      maximum: 179.999999,
      minimum: 0,
      unit: "°",
    },
    {
      default: 10,
      description: "Edge-emitter slow-axis full-angle divergence.",
      id: "edgeSlowAxisDeg",
      kind: "number",
      label: "Slow axis",
      maximum: 179.999999,
      minimum: 0,
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Spot diameter from the circular VCSEL beam.",
      id: "spotVcselMm",
      kind: "number",
      label: "VCSEL spot",
      unit: "mm",
    },
    {
      description: "Spot diameter along the edge-emitter fast axis.",
      id: "spotEdgeFastMm",
      kind: "number",
      label: "Fast-axis spot",
      unit: "mm",
    },
    {
      description: "Spot diameter along the edge-emitter slow axis.",
      id: "spotEdgeSlowMm",
      kind: "number",
      label: "Slow-axis spot",
      unit: "mm",
    },
    {
      description: "Astigmatism remark for edge emitters.",
      id: "astigmatismNote",
      kind: "string",
      label: "Astigmatism note",
    },
  ],
  title: "VCSEL vs Edge-Emitter Divergence Comparison",
});
export const runVcselEdgeEmitterComparison =
  vcselEdgeEmitterComparisonTool.execute;
export default vcselEdgeEmitterComparisonTool;

export { vcselEdgeEmitterComparisonExample as example };
