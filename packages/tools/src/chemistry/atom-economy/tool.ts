import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const atomEconomyExample = {
  input: { molarMassDesiredProduct: 32, sumMolarMassAllProducts: 80 },
} satisfies ToolExample<{
  readonly molarMassDesiredProduct: number;
  readonly sumMolarMassAllProducts: number;
}>;

export const atomEconomyTool = createSimpleTool({
  id: "chemistry/atom-economy",
  title: "Atom Economy Calculator",
  description:
    "Compute atom economy as desired product molar mass over total products molar mass times 100.",
  inputs: [
    {
      id: "molarMassDesiredProduct",
      label: "Desired product molar mass",
      kind: "number",
      unit: "g/mol",
    },
    {
      id: "sumMolarMassAllProducts",
      label: "Total products molar mass",
      kind: "number",
      unit: "g/mol",
    },
  ],
  outputs: [
    {
      id: "atomEconomyPercent",
      label: "Atom economy",
      kind: "number",
      unit: "%",
    },
  ],
  calculate: (input) => {
    const molarMassDesiredProduct = input.molarMassDesiredProduct as number;
    const sumMolarMassAllProducts = input.sumMolarMassAllProducts as number;
    if (!(molarMassDesiredProduct > 0))
      simpleError(
        "molarMassDesiredProduct",
        "Desired product molar mass must be positive.",
      );
    if (!(sumMolarMassAllProducts > 0))
      simpleError(
        "sumMolarMassAllProducts",
        "Total products molar mass must be positive.",
      );
    if (molarMassDesiredProduct > sumMolarMassAllProducts)
      simpleError(
        "molarMassDesiredProduct",
        "Desired product molar mass must not exceed total products molar mass.",
      );
    return {
      atomEconomyPercent:
        (molarMassDesiredProduct / sumMolarMassAllProducts) * 100,
    };
  },
});
export const runAtomEconomy = atomEconomyTool.execute;
export default atomEconomyTool;
