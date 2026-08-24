import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QclTargetGas =
  | "co2"
  | "ch4"
  | "n2o"
  | "co"
  | "nh3"
  | "h2o"
  | "so2"
  | "no"
  | "no2"
  | "o3"
  | "hcl"
  | "hf"
  | "ethanol"
  | "formaldehyde";

export type QclFingerprintSelection = {
  readonly centerUm: number;
  readonly windowHighUm: number;
  readonly windowLowUm: number;
  readonly note: string;
};

type FingerprintRow = {
  readonly gas: QclTargetGas;
  readonly highUm: number;
  readonly lowUm: number;
  readonly note: string;
};

const FINGERPRINTS: readonly FingerprintRow[] = [
  {
    gas: "co2",
    highUm: 4.4,
    lowUm: 4.2,
    note: "Strong asymmetric-stretch band — the flagship QCL sensing window.",
  },
  {
    gas: "ch4",
    highUm: 3.45,
    lowUm: 3.25,
    note: "ν₃ C–H stretch fundamental.",
  },
  {
    gas: "n2o",
    highUm: 4.6,
    lowUm: 4.45,
    note: "Climate-gas monitoring line bundle.",
  },
  {
    gas: "co",
    highUm: 4.72,
    lowUm: 4.55,
    note: "Fundamental ro-vibrational band; sits beside CO₂ sidebands.",
  },
  {
    gas: "nh3",
    highUm: 10.8,
    lowUm: 9.2,
    note: "Broad ν₂ umbrella band overlapping CO₂-laser lines.",
  },
  {
    gas: "h2o",
    highUm: 6.5,
    lowUm: 5.9,
    note: "Dense ν₂ rotational-vibrational manifold.",
  },
  { gas: "so2", highUm: 7.5, lowUm: 7.2, note: "Strong ν₁ absorption block." },
  {
    gas: "no",
    highUm: 5.45,
    lowUm: 5.2,
    note: "Fundamental band used for NO flux sensing.",
  },
  {
    gas: "no2",
    highUm: 6.4,
    lowUm: 6.15,
    note: "Asymmetric-stretch fingerprint.",
  },
  {
    gas: "o3",
    highUm: 9.9,
    lowUm: 9.4,
    note: "ν₃ asymmetric stretch of ozone.",
  },
  {
    gas: "hcl",
    highUm: 3.6,
    lowUm: 3.4,
    note: "Isotope-resolved H³⁵Cl/H³⁷Cl doublets.",
  },
  {
    gas: "hf",
    highUm: 2.55,
    lowUm: 2.45,
    note: "Fundamental with a large dipole transition strength.",
  },
  {
    gas: "ethanol",
    highUm: 9.6,
    lowUm: 9.3,
    note: "C–O stretching fingerprint.",
  },
  {
    gas: "formaldehyde",
    highUm: 3.65,
    lowUm: 3.55,
    note: "ν₅/ν₆ C–H stretches.",
  },
];

export const selectQclFingerprint = (
  gas: QclTargetGas,
): QclFingerprintSelection => {
  const row = FINGERPRINTS.find((entry) => entry.gas === gas);
  if (row === undefined)
    return simpleError("gasId", "Choose one of the supported target gases.");
  const result: QclFingerprintSelection = {
    centerUm: (row.lowUm + row.highUm) / 2,
    note: row.note,
    windowHighUm: row.highUm,
    windowLowUm: row.lowUm,
  };
  return result;
};

export const qclGasFingerprintExample = {
  input: { gasId: "co2" },
  output: selectQclFingerprint("co2"),
} satisfies ToolExample<{ gasId: QclTargetGas }, QclFingerprintSelection>;

const GASES = FINGERPRINTS.map((row) => row.gas);

export const qclGasFingerprintTool = createSimpleTool({
  calculate: (input) => selectQclFingerprint(input.gasId as QclTargetGas),
  description:
    "Return the mid-infrared QCL emission window that targets the strongest ro-vibrational fingerprint of a common gas.",
  id: "laser/laser-quantum-cascade-laser-mid-ir-fingerprint-selection-table-lookup",
  inputs: [
    {
      description: "Target molecule to monitor.",
      enum: GASES,
      id: "gasId",
      kind: "string",
      label: "Target gas",
    },
  ],
  outputs: [
    {
      description: "Centre of the recommended emission window.",
      id: "centerUm",
      kind: "number",
      label: "Centre wavelength",
      unit: "µm",
    },
    {
      description: "Lower edge of the useful window.",
      id: "windowLowUm",
      kind: "number",
      label: "Window low",
      unit: "µm",
    },
    {
      description: "Upper edge of the useful window.",
      id: "windowHighUm",
      kind: "number",
      label: "Window high",
      unit: "µm",
    },
    {
      description: "Selection remark for the gas.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "QCL Gas Fingerprint Selection Table",
});
export const runQclGasFingerprint = qclGasFingerprintTool.execute;
export default qclGasFingerprintTool;

export { qclGasFingerprintExample as example };
