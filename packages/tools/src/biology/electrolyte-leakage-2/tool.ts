import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ElectrolyteLeakage2Input = {
  readonly initialConductivityUs: number;
  readonly maximumConductivityUs: number;
};

export type ElectrolyteLeakage2Output = {
  readonly electrolyteLeakageRatio: number;
};

export const electrolyteLeakage2Example = {
  input: { initialConductivityUs: 120, maximumConductivityUs: 300 },
  output: { electrolyteLeakageRatio: 0.4 },
} satisfies ToolExample<ElectrolyteLeakage2Input, ElectrolyteLeakage2Output>;

export const electrolyteLeakage2Tool = createSimpleTool({
  id: "biology/electrolyte-leakage-2",
  title: "Leakage Two Step",
  description:
    "Compute the electrolyte leakage ratio as the initial conductivity divided by the maximum conductivity measured after a second boil; the result is a fraction between zero and one.",
  inputs: [
    {
      description:
        "Maximum conductivity in microsiemens after the second boil; must be greater than zero.",
      id: "maximumConductivityUs",
      kind: "number",
      label: "Maximum conductivity",
      unit: "uS",
    },
    {
      description:
        "Initial conductivity in microsiemens after the first soak; must not exceed the maximum conductivity.",
      id: "initialConductivityUs",
      kind: "number",
      label: "Initial conductivity",
      unit: "uS",
    },
  ],
  outputs: [
    {
      description: "Electrolyte leakage ratio between 0 and 1.",
      id: "electrolyteLeakageRatio",
      kind: "number",
      label: "Electrolyte leakage ratio",
    },
  ],
  calculate: (input) => {
    const maximumConductivityUs = input.maximumConductivityUs as number;
    const initialConductivityUs = input.initialConductivityUs as number;
    if (!(
      maximumConductivityUs > 0 &&
      initialConductivityUs >= 0 &&
      initialConductivityUs <= maximumConductivityUs
    ))
      simpleError(
        "maximumConductivityUs",
        "The maximum conductivity must be positive and at least the initial conductivity.",
        "invalid_conductivities",
      );
    return {
      electrolyteLeakageRatio: initialConductivityUs / maximumConductivityUs,
    };
  },
});
export const runElectrolyteLeakage2 = electrolyteLeakage2Tool.execute;
export default electrolyteLeakage2Tool;
