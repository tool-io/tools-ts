import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TrenchMosfetSpecificOnResistanceInput = Readonly<{
  readonly onOhms: number;
  readonly activeAreaSquareCentimeters: number;
}>;
export type TrenchMosfetSpecificOnResistanceOutput = Readonly<{
  readonly specificOnOhmSquareCentimeters: number;
}>;

export const calculateTrenchMosfetSpecificOnResistance = (
  x: TrenchMosfetSpecificOnResistanceInput,
): TrenchMosfetSpecificOnResistanceOutput => {
  if (!Number.isFinite(x.onOhms) || x.onOhms < 0)
    simpleError("onOhms", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.activeAreaSquareCentimeters) ||
    x.activeAreaSquareCentimeters < 0
  )
    simpleError(
      "activeAreaSquareCentimeters",
      "Provide a finite number at least 0.",
    );
  const specificOnOhmSquareCentimeters =
    x.onOhms * x.activeAreaSquareCentimeters;
  if (!Number.isFinite(specificOnOhmSquareCentimeters))
    simpleError(
      "specificOnOhmSquareCentimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    specificOnOhmSquareCentimeters: Object.is(
      specificOnOhmSquareCentimeters,
      -0,
    )
      ? 0
      : specificOnOhmSquareCentimeters,
  };
};

export const example = {
  input: { onOhms: 0.01, activeAreaSquareCentimeters: 0.1 },
  output: { specificOnOhmSquareCentimeters: 0.001 },
} satisfies ToolExample<
  TrenchMosfetSpecificOnResistanceInput,
  TrenchMosfetSpecificOnResistanceOutput
>;

export const tool = createSimpleTool({
  id: "semiconductor/trench-mosfet-specific-on-resistance",
  title: "Trench Mosfet Specific On Resistance",
  description:
    "Trench MOSFET area-specific on-resistance from measured device on-resistance and active die area.",
  inputs: [
    { id: "onOhms", kind: "number", label: "On Ohms", unit: "Ω", minimum: 0 },
    {
      id: "activeAreaSquareCentimeters",
      kind: "number",
      label: "Active Area Square Centimeters",
      unit: "cm²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "specificOnOhmSquareCentimeters",
      kind: "number",
      label: "Specific On Ohm Square Centimeters",
      unit: "Ω·cm²",
    },
  ],
  calculate: (input) =>
    calculateTrenchMosfetSpecificOnResistance({
      onOhms: input.onOhms as number,
      activeAreaSquareCentimeters: input.activeAreaSquareCentimeters as number,
    }),
});
export const trenchMosfetSpecificOnResistanceTool = tool;
export const runTrenchMosfetSpecificOnResistance = tool.execute;
export default tool;
