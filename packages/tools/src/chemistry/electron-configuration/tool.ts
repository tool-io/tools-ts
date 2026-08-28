import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const FILLING_ORDER: readonly (readonly [label: string, capacity: number])[] = [
  ["1s", 2],
  ["2s", 2],
  ["2p", 6],
  ["3s", 2],
  ["3p", 6],
  ["4s", 2],
  ["3d", 10],
  ["4p", 6],
  ["5s", 2],
  ["4d", 10],
  ["5p", 6],
  ["6s", 2],
  ["4f", 14],
  ["5d", 10],
  ["6p", 6],
  ["7s", 2],
  ["5f", 14],
  ["6d", 10],
  ["7p", 6],
];

const SUPERSCRIPTS: Record<string, string> = {
  "0": "\u2070",
  "1": "\u00b9",
  "2": "\u00b2",
  "3": "\u00b3",
  "4": "\u2074",
  "5": "\u2075",
  "6": "\u2076",
  "7": "\u2077",
  "8": "\u2078",
  "9": "\u2079",
};

const GROUND_STATE_EXCEPTIONS: Readonly<
  Record<number, Readonly<Record<string, number>>>
> = {
  24: { "3d": 5, "4s": 1 },
  29: { "3d": 10, "4s": 1 },
  41: { "4d": 4, "5s": 1 },
  42: { "4d": 5, "5s": 1 },
  44: { "4d": 7, "5s": 1 },
  45: { "4d": 8, "5s": 1 },
  46: { "4d": 10, "5s": 0 },
  47: { "4d": 10, "5s": 1 },
  57: { "4f": 0, "5d": 1 },
  58: { "4f": 1, "5d": 1 },
  64: { "4f": 7, "5d": 1 },
  78: { "5d": 9, "6s": 1 },
  79: { "5d": 10, "6s": 1 },
  89: { "5f": 0, "6d": 1 },
  90: { "5f": 0, "6d": 2 },
  91: { "5f": 2, "6d": 1 },
  92: { "5f": 3, "6d": 1 },
  93: { "5f": 4, "6d": 1 },
  96: { "5f": 7, "6d": 1 },
  103: { "6d": 0, "7p": 1 },
};

const superscript = (value: number): string =>
  String(value)
    .split("")
    .map((digit) => SUPERSCRIPTS[digit]!)
    .join("");

export const electronConfigurationTool = createSimpleTool({
  id: "chemistry/electron-configuration",
  title: "Electron Configuration Generator",
  description:
    "Generate the ground-state electron configuration of a neutral atom using the Aufbau principle.",
  inputs: [
    {
      description: "Atomic number between one and 118.",
      id: "atomicNumber",
      label: "Atomic number",
      kind: "integer",
      maximum: 118,
      minimum: 1,
    },
  ],
  outputs: [
    {
      description: "Configuration in Aufbau order with superscript counts.",
      id: "configuration",
      label: "Configuration",
      kind: "string",
    },
  ],
  calculate: (input) => {
    let remaining = input.atomicNumber as number;
    const occupancies = new Map<string, number>();
    for (const [label, capacity] of FILLING_ORDER) {
      if (remaining === 0) break;
      const placed = Math.min(remaining, capacity);
      remaining -= placed;
      occupancies.set(label, placed);
    }
    const exception = GROUND_STATE_EXCEPTIONS[input.atomicNumber as number];
    if (exception)
      for (const [label, count] of Object.entries(exception))
        occupancies.set(label, count);
    const parts = FILLING_ORDER.flatMap(([label]) => {
      const count = occupancies.get(label) ?? 0;
      return count > 0 ? [`${label}${superscript(count)}`] : [];
    });
    return { configuration: parts.join("") };
  },
});
export const runElectronConfiguration = electronConfigurationTool.execute;
export default electronConfigurationTool;

export type ElectronConfigurationInput = {
  readonly atomicNumber: number;
};

export type ElectronConfigurationOutput = {
  readonly configuration: string;
};

export const electronConfigurationExample = {
  input: {
    atomicNumber: 1,
  },
  output: {
    configuration: "1s¹",
  },
} satisfies ToolExample<
  ElectronConfigurationInput,
  ElectronConfigurationOutput
>;
