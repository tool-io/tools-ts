import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ReactorConversionInput = Readonly<{
  readonly inletMolesPerSecond: number;
  readonly outletMolesPerSecond: number;
}>;
export type ReactorConversionOutput = Readonly<{
  readonly conversionFraction: number;
}>;

export const calculateReactorConversion = (
  x: ReactorConversionInput,
): ReactorConversionOutput => {
  if (!Number.isFinite(x.inletMolesPerSecond) || x.inletMolesPerSecond < 0)
    simpleError("inletMolesPerSecond", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.outletMolesPerSecond) || x.outletMolesPerSecond < 0)
    simpleError("outletMolesPerSecond", "Provide a finite number at least 0.");
  if (x.outletMolesPerSecond > x.inletMolesPerSecond)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const conversionFraction =
    (x.inletMolesPerSecond - x.outletMolesPerSecond) / x.inletMolesPerSecond;
  if (!Number.isFinite(conversionFraction))
    simpleError(
      "conversionFraction",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    conversionFraction: Object.is(conversionFraction, -0)
      ? 0
      : conversionFraction,
  };
};

export const example = {
  input: { inletMolesPerSecond: 10, outletMolesPerSecond: 3 },
  output: { conversionFraction: 0.7 },
} satisfies ToolExample<ReactorConversionInput, ReactorConversionOutput>;

export const tool = createSimpleTool({
  id: "engineering/reactor-conversion",
  title: "Reactor Conversion",
  description:
    "Single-reactant chemical conversion fraction from inlet and outlet molar flow rates on a consistent basis.",
  inputs: [
    {
      id: "inletMolesPerSecond",
      kind: "number",
      label: "Inlet Moles Per Second",
      unit: "mol/s",
      minimum: 0,
    },
    {
      id: "outletMolesPerSecond",
      kind: "number",
      label: "Outlet Moles Per Second",
      unit: "mol/s",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "conversionFraction", kind: "number", label: "Conversion Fraction" },
  ],
  calculate: (input) =>
    calculateReactorConversion({
      inletMolesPerSecond: input.inletMolesPerSecond as number,
      outletMolesPerSecond: input.outletMolesPerSecond as number,
    }),
});
export const reactorConversionTool = tool;
export const runReactorConversion = tool.execute;
export default tool;
