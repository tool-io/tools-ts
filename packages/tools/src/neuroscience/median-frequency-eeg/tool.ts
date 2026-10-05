import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly frequenciesHz: readonly number[];
  readonly binPowers: readonly number[];
};
export type Output = {
  readonly medianFrequencyHz: number;
  readonly binIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frequenciesHz: { type: "array", maxItems: 256, items: { type: "number" } },
    binPowers: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["frequenciesHz", "binPowers"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    medianFrequencyHz: { type: "number" },
    binIndex: { type: "integer" },
  },
  required: ["medianFrequencyHz", "binIndex"],
} as const;
/** Find the first increasing nonnegative EEG frequency bin containing at least half the supplied nonnegative bin-integrated power. Exact half-power ties choose the lower bin; no interpolation or clinical interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { frequenciesHz, binPowers } = request;
  const compute = (): Output => {
    H.sameLength(frequenciesHz, binPowers);
    H.domain(frequenciesHz.length > 0, "frequenciesHz");
    frequenciesHz.forEach((v, i) =>
      H.domain(
        v >= 0 && (i === 0 || v > frequenciesHz[i - 1]),
        "frequenciesHz",
      ),
    );
    binPowers.forEach((v) => H.domain(v >= 0, "binPowers"));
    const scale = Math.max(...binPowers);
    H.domain(scale > 0, "binPowers");
    const scaled = binPowers.map((v) => v / scale);
    const half = scaled.reduce((a, b) => a + b, 0) / 2;
    let cumulative = 0;
    for (let i = 0; i < scaled.length; i++) {
      cumulative += scaled[i];
      if (cumulative >= half)
        return { medianFrequencyHz: frequenciesHz[i], binIndex: i };
    }
    return {
      medianFrequencyHz: frequenciesHz[frequenciesHz.length - 1],
      binIndex: frequenciesHz.length - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { frequenciesHz: [1, 2, 4, 8], binPowers: [1, 2, 5, 2] },
  output: { medianFrequencyHz: 4, binIndex: 2 },
} satisfies ToolExample<Input, Output>;
export const medianFrequencyEegTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "neuroscience/median-frequency-eeg",
    title: "Median Frequency EEG Calculator",
    description:
      "Find the first increasing nonnegative EEG frequency bin containing at least half the supplied nonnegative bin-integrated power. Exact half-power ties choose the lower bin; no interpolation or clinical interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        frequenciesHz: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        binPowers: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["frequenciesHz", "binPowers"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        medianFrequencyHz: { type: "number" },
        binIndex: { type: "integer" },
      },
      required: ["medianFrequencyHz", "binIndex"],
    },
    ports: {
      inputs: [
        {
          id: "frequenciesHz",
          label: "Frequencies Hz",
          required: true,
          valueType: { type: "list", items: { type: "number" }, unit: "Hz" },
        },
        {
          id: "binPowers",
          label: "Bin Powers",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "medianFrequencyHz",
          label: "Median Frequency Hz",
          valueType: { type: "number", unit: "Hz" },
        },
        { id: "binIndex", label: "Bin Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = medianFrequencyEegTool.execute;
export default medianFrequencyEegTool;
