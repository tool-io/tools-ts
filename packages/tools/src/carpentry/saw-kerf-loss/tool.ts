import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SawKerfLossInput = Readonly<{
  readonly cutCount: number;
  readonly kerfWidthMm: number;
}>;
export type SawKerfLossOutput = Readonly<{
  readonly totalKerfLossMm: number;
}>;

export const calculateSawKerfLoss = (
  x: SawKerfLossInput,
): SawKerfLossOutput => {
  if (!Number.isSafeInteger(x.cutCount) || x.cutCount < 0)
    simpleError("cutCount", "Provide a safe integer at least 0.");
  if (!Number.isFinite(x.kerfWidthMm) || x.kerfWidthMm < 0)
    simpleError("kerfWidthMm", "Provide a finite number at least 0.");
  const totalKerfLossMm = x.cutCount * x.kerfWidthMm;
  if (!Number.isFinite(totalKerfLossMm))
    simpleError("totalKerfLossMm", "The inputs produce an invalid result.");
  return {
    totalKerfLossMm: Object.is(totalKerfLossMm, -0) ? 0 : totalKerfLossMm,
  };
};

export const example = {
  input: { cutCount: 5, kerfWidthMm: 3 },
  output: { totalKerfLossMm: 15 },
} satisfies ToolExample<SawKerfLossInput, SawKerfLossOutput>;

export const tool = createSimpleTool({
  id: "carpentry/saw-kerf-loss",
  title: "Saw Kerf Loss",
  description:
    "Calculate total stock length removed by a known number of full-width saw cuts and blade kerf width.",
  inputs: [
    { id: "cutCount", kind: "integer", label: "Full-width cuts", minimum: 0 },
    {
      id: "kerfWidthMm",
      kind: "number",
      label: "Measured blade kerf",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "totalKerfLossMm",
      kind: "number",
      label: "Total kerf loss",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateSawKerfLoss({
      cutCount: input.cutCount as number,
      kerfWidthMm: input.kerfWidthMm as number,
    }),
});
export const sawKerfLossTool = tool;
export const runSawKerfLoss = tool.execute;
export default tool;
