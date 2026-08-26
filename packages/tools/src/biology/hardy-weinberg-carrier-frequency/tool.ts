import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HardyWeinbergCarrierFrequencyInput = {
  readonly recessiveDiseaseIncidence: number;
};

export type HardyWeinbergCarrierFrequencyOutput = {
  readonly carrierFrequency: number;
};

export const hardyWeinbergCarrierFrequencyExample = {
  input: { recessiveDiseaseIncidence: 0.04 },
  output: { carrierFrequency: 0.32000000000000006 },
} satisfies ToolExample<
  HardyWeinbergCarrierFrequencyInput,
  HardyWeinbergCarrierFrequencyOutput
>;

export const hardyWeinbergCarrierFrequencyTool = createSimpleTool({
  id: "biology/hardy-weinberg-carrier-frequency",
  title: "Carrier Frequency",
  description:
    "Estimate heterozygous carrier frequency 2q(1-q) from the incidence q^2 of a recessive disease.",
  inputs: [
    {
      id: "recessiveDiseaseIncidence",
      label: "Recessive disease incidence",
      kind: "number",
    },
  ],
  outputs: [
    { id: "carrierFrequency", label: "Carrier frequency", kind: "number" },
  ],
  calculate: (input) => {
    const incidence = input.recessiveDiseaseIncidence as number;
    if (!(incidence >= 0 && incidence <= 1))
      simpleError(
        "recessiveDiseaseIncidence",
        "Incidence must be between zero and one.",
      );
    const q = Math.sqrt(incidence);
    return { carrierFrequency: 2 * q * (1 - q) };
  },
});
export const runHardyWeinbergCarrierFrequency =
  hardyWeinbergCarrierFrequencyTool.execute;
export default hardyWeinbergCarrierFrequencyTool;
