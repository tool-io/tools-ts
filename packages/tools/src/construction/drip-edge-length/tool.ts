import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DripEdgeLengthInput = Readonly<{
  readonly eaveLengthM: number;
  readonly rakeLengthM: number;
  readonly wastePercent: number;
}>;
export type DripEdgeLengthOutput = Readonly<{
  readonly dripEdgeLengthM: number;
}>;

export const calculateDripEdgeLength = (
  x: DripEdgeLengthInput,
): DripEdgeLengthOutput => {
  if (!Number.isFinite(x.eaveLengthM) || x.eaveLengthM < 0)
    simpleError("eaveLengthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.rakeLengthM) || x.rakeLengthM < 0)
    simpleError("rakeLengthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wastePercent) || x.wastePercent < 0)
    simpleError("wastePercent", "Provide a finite number at least 0.");
  const dripEdgeLengthM =
    (x.eaveLengthM + x.rakeLengthM) * (1 + x.wastePercent / 100);
  if (!Number.isFinite(dripEdgeLengthM))
    simpleError("dripEdgeLengthM", "The inputs produce an invalid result.");
  return {
    dripEdgeLengthM: Object.is(dripEdgeLengthM, -0) ? 0 : dripEdgeLengthM,
  };
};

export const example = {
  input: { eaveLengthM: 20, rakeLengthM: 12, wastePercent: 10 },
  output: { dripEdgeLengthM: 35.2 },
} satisfies ToolExample<DripEdgeLengthInput, DripEdgeLengthOutput>;

export const tool = createSimpleTool({
  id: "construction/drip-edge-length",
  title: "Drip Edge Length",
  description:
    "Total roof drip-edge material along measured eaves and rakes, including a waste allowance for cuts.",
  inputs: [
    {
      id: "eaveLengthM",
      kind: "number",
      label: "Combined eave length",
      unit: "m",
      minimum: 0,
    },
    {
      id: "rakeLengthM",
      kind: "number",
      label: "Combined rake length",
      unit: "m",
      minimum: 0,
    },
    {
      id: "wastePercent",
      kind: "number",
      label: "Cut allowance",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "dripEdgeLengthM",
      kind: "number",
      label: "Drip-edge length",
      unit: "m",
    },
  ],
  calculate: (input) =>
    calculateDripEdgeLength({
      eaveLengthM: input.eaveLengthM as number,
      rakeLengthM: input.rakeLengthM as number,
      wastePercent: input.wastePercent as number,
    }),
});
export const dripEdgeLengthTool = tool;
export const runDripEdgeLength = tool.execute;
export default tool;
