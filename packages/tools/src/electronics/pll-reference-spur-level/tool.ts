import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PllReferenceSpurLevelInput = Readonly<{
  readonly spurDbm: number;
  readonly carrierDbm: number;
}>;
export type PllReferenceSpurLevelOutput = Readonly<{
  readonly spurDbc: number;
}>;

export const calculatePllReferenceSpurLevel = (
  x: PllReferenceSpurLevelInput,
): PllReferenceSpurLevelOutput => {
  if (!Number.isFinite(x.spurDbm))
    simpleError("spurDbm", "Provide a finite number.");
  if (!Number.isFinite(x.carrierDbm))
    simpleError("carrierDbm", "Provide a finite number.");
  const spurDbc = x.spurDbm - x.carrierDbm;
  if (!Number.isFinite(spurDbc))
    simpleError("spurDbc", "Inputs produce an undefined or non-finite result.");
  return { spurDbc: Object.is(spurDbc, -0) ? 0 : spurDbc };
};

export const example = {
  input: { spurDbm: -50, carrierDbm: 0 },
  output: { spurDbc: -50 },
} satisfies ToolExample<
  PllReferenceSpurLevelInput,
  PllReferenceSpurLevelOutput
>;

export const tool = createSimpleTool({
  id: "electronics/pll-reference-spur-level",
  title: "PLL Reference Spur Level",
  description:
    "Reference-spur level relative to carrier in dBc from measured spur and carrier powers in dBm.",
  inputs: [
    { id: "spurDbm", kind: "number", label: "Spur Dbm", unit: "dBm" },
    { id: "carrierDbm", kind: "number", label: "Carrier Dbm", unit: "dBm" },
  ],
  outputs: [{ id: "spurDbc", kind: "number", label: "Spur Dbc", unit: "dBc" }],
  calculate: (input) =>
    calculatePllReferenceSpurLevel({
      spurDbm: input.spurDbm as number,
      carrierDbm: input.carrierDbm as number,
    }),
});
export const pllReferenceSpurLevelTool = tool;
export const runPllReferenceSpurLevel = tool.execute;
export default tool;
