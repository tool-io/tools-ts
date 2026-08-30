import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EdgeBandingLengthInput = Readonly<{
  readonly exposedEdgeLengthsM: readonly number[];
  readonly wastePercent: number;
}>;
export type EdgeBandingLengthOutput = Readonly<{
  readonly bandingLengthM: number;
}>;

export const calculateEdgeBandingLength = (
  x: EdgeBandingLengthInput,
): EdgeBandingLengthOutput => {
  if (
    !Array.isArray(x.exposedEdgeLengthsM) ||
    !x.exposedEdgeLengthsM.every(
      (v) => typeof v === "number" && Number.isFinite(v),
    )
  )
    simpleError("exposedEdgeLengthsM", "Provide a finite number list.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  if (!x.exposedEdgeLengthsM.every((v) => v >= 0))
    simpleError("exposedEdgeLengthsM", "Edge lengths cannot be negative.");
  const bandingLengthM =
    x.exposedEdgeLengthsM.reduce((a, b) => a + b, 0) *
    (1 + x.wastePercent / 100);
  if (!Number.isFinite(bandingLengthM))
    simpleError("bandingLengthM", "The inputs produce an invalid result.");
  return { bandingLengthM: Object.is(bandingLengthM, -0) ? 0 : bandingLengthM };
};

export const example = {
  input: { exposedEdgeLengthsM: [1, 2], wastePercent: 10 },
  output: { bandingLengthM: 3.3000000000000003 },
} satisfies ToolExample<EdgeBandingLengthInput, EdgeBandingLengthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/edge-banding-length",
  title: "Edge Banding Length",
  description:
    "Sum exposed panel edges and add an explicit allowance for trimming and waste.",
  inputs: [
    {
      id: "exposedEdgeLengthsM",
      kind: "numberList",
      label: "Exposed edge lengths",
      unit: "m",
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Trim allowance",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "bandingLengthM",
      kind: "number",
      label: "Banding material length",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateEdgeBandingLength({
      exposedEdgeLengthsM: input.exposedEdgeLengthsM as readonly number[],
      wastePercent: input.wastePercent as number,
    }),
});
export const edgeBandingLengthTool = tool;
export const runEdgeBandingLength = tool.execute;
export default tool;
