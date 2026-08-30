import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RebarTieWirePerTonInput = Readonly<{
  readonly rebarMassMetricTons: number;
  readonly wireKgPerMetricTon: number;
}>;
export type RebarTieWirePerTonOutput = Readonly<{
  readonly wireMassKg: number;
}>;

export const calculateRebarTieWirePerTon = (
  x: RebarTieWirePerTonInput,
): RebarTieWirePerTonOutput => {
  if (!Number.isFinite(x.rebarMassMetricTons) || x.rebarMassMetricTons < 0)
    simpleError("rebarMassMetricTons", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.wireKgPerMetricTon) || x.wireKgPerMetricTon < 0)
    simpleError("wireKgPerMetricTon", "Provide a finite number at least 0.");
  const wireMassKg = x.rebarMassMetricTons * x.wireKgPerMetricTon;
  if (!Number.isFinite(wireMassKg))
    simpleError("wireMassKg", "The inputs produce an invalid result.");
  return { wireMassKg: Object.is(wireMassKg, -0) ? 0 : wireMassKg };
};

export const example = {
  input: { rebarMassMetricTons: 2, wireKgPerMetricTon: 10 },
  output: { wireMassKg: 20 },
} satisfies ToolExample<RebarTieWirePerTonInput, RebarTieWirePerTonOutput>;

export const tool = createSimpleTool({
  id: "construction/rebar-tie-wire-per-ton",
  title: "Rebar Tie Wire Per Ton",
  description:
    "Estimate tie-wire mass from installed rebar tonnage and a project-specific wire allowance per metric ton.",
  inputs: [
    {
      id: "rebarMassMetricTons",
      kind: "number",
      label: "Rebar mass",
      unit: "t",
      minimum: 0,
    },
    {
      id: "wireKgPerMetricTon",
      kind: "number",
      label: "Wire allowance",
      unit: "kg/t",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "wireMassKg", kind: "number", label: "Tie-wire mass", unit: "kg" },
  ],
  calculate: (input) =>
    calculateRebarTieWirePerTon({
      rebarMassMetricTons: input.rebarMassMetricTons as number,
      wireKgPerMetricTon: input.wireKgPerMetricTon as number,
    }),
});
export const rebarTieWirePerTonTool = tool;
export const runRebarTieWirePerTon = tool.execute;
export default tool;
