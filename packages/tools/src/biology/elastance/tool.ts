import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const elastanceExample = {
  input: { tidalVolumeLiters: 0.5, transpulmonaryPressureCmH2o: 5 },
  output: { elastanceCmh2oPerL: 10 },
} satisfies ToolExample<
  {
    readonly tidalVolumeLiters: number;
    readonly transpulmonaryPressureCmH2o: number;
  },
  { readonly elastanceCmh2oPerL: number }
>;

export const elastanceTool = createSimpleTool({
  id: "biology/elastance",
  title: "Elastance Calculator",
  description:
    "Compute respiratory elastance as transpulmonary pressure divided by tidal volume in liters.",
  inputs: [
    {
      id: "transpulmonaryPressureCmH2o",
      label: "Transpulmonary pressure",
      kind: "number",
      unit: "cmH2O",
    },
    {
      id: "tidalVolumeLiters",
      label: "Tidal volume",
      kind: "number",
      unit: "L",
    },
  ],
  outputs: [
    {
      id: "elastanceCmh2oPerL",
      label: "Elastance",
      kind: "number",
      unit: "cmH2O/L",
    },
  ],
  calculate: (input) => {
    const transpulmonaryPressureCmH2o =
      input.transpulmonaryPressureCmH2o as number;
    const tidalVolumeLiters = input.tidalVolumeLiters as number;
    if (tidalVolumeLiters <= 0)
      simpleError(
        "tidalVolumeLiters",
        "Tidal volume must be greater than zero.",
      );
    if (transpulmonaryPressureCmH2o < 0)
      simpleError(
        "transpulmonaryPressureCmH2o",
        "Transpulmonary pressure must not be negative.",
        "negative_pressure",
      );
    return {
      elastanceCmh2oPerL: transpulmonaryPressureCmH2o / tidalVolumeLiters,
    };
  },
});
export const runElastance = elastanceTool.execute;
export default elastanceTool;
