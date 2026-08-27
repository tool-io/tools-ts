import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const primerMeltingTempNearestNeighborExample = {
  input: { sequence: "ATCGCGTA" },
} satisfies ToolExample<{
  readonly naConcentrationM?: number;
  readonly sequence: string;
}>;

export const primerMeltingTempNearestNeighborTool = createSimpleTool({
  id: "biology/primer-melting-temp-nearest-neighbor",
  title: "Nearest Neighbor Tm Approx",
  description:
    "Approximate primer melting temperature with a salt-adjusted nearest-neighbor style formula.",
  inputs: [
    { id: "sequence", label: "Primer sequence", kind: "string" },
    {
      default: 0.05,
      id: "naConcentrationM",
      label: "Sodium concentration",
      kind: "number",
      unit: "M",
    },
  ],
  outputs: [
    {
      id: "meltingTempC",
      label: "Melting temperature",
      kind: "number",
      unit: "°C",
    },
  ],
  calculate: (input) => {
    const sequence = input.sequence as string;
    const naConcentrationM = input.naConcentrationM as number;
    if (sequence === "")
      simpleError("sequence", "Sequence must not be empty.", "empty_sequence");
    if (!/^[ACGT]+$/.test(sequence))
      simpleError(
        "sequence",
        "Sequence must contain only uppercase A, C, G and T.",
        "invalid_sequence",
      );
    if (naConcentrationM <= 0)
      simpleError(
        "naConcentrationM",
        "Sodium concentration must be greater than zero.",
        "invalid_concentration",
      );
    let gcCount = 0;
    for (const base of sequence) if (base === "G" || base === "C") gcCount += 1;
    const length = sequence.length;
    return {
      meltingTempC:
        81.5 +
        16.6 * Math.log10(naConcentrationM) +
        (41 * gcCount) / length -
        500 / length,
    };
  },
});
export const runPrimerMeltingTempNearestNeighbor =
  primerMeltingTempNearestNeighborTool.execute;
export default primerMeltingTempNearestNeighborTool;
