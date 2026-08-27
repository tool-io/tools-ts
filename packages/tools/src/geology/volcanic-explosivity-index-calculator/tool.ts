import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const VEI_NAMES = [
  "non-explosive",
  "gentle",
  "explosive",
  "severe",
  "cataclysmic",
  "paroxysmal",
  "colossal",
  "super-colossal",
  "mega-colossal",
] as const;

export type VolcanicExplosivityIndexCalculatorInput = {
  readonly bulkVolumeCubicMeters: number;
};

export type VolcanicExplosivityIndexCalculatorOutput = {
  readonly classification: string;
  readonly vei: number;
};

export const calculateVolcanicExplosivityIndexCalculator = (
  input: VolcanicExplosivityIndexCalculatorInput,
): VolcanicExplosivityIndexCalculatorOutput => {
  if (!(input.bulkVolumeCubicMeters > 0))
    simpleError(
      "bulkVolumeCubicMeters",
      "Bulk ejecta volume must be greater than zero.",
      "invalid_volume",
    );
  const volume = input.bulkVolumeCubicMeters;
  const vei =
    volume < 1e4
      ? 0
      : volume < 1e6
        ? 1
        : Math.min(8, Math.floor(Math.log10(volume)) - 4);
  return { classification: VEI_NAMES[vei], vei };
};

export const volcanicExplosivityIndexCalculatorExample = {
  input: { bulkVolumeCubicMeters: 1e11 },
  output: { classification: "super-colossal", vei: 7 },
} satisfies ToolExample<
  VolcanicExplosivityIndexCalculatorInput,
  VolcanicExplosivityIndexCalculatorOutput
>;

export const volcanicExplosivityIndexCalculatorTool = createSimpleTool({
  id: "geology/volcanic-explosivity-index-calculator",
  title: "Volcanic Explosivity Index Calculator",
  description:
    "Assign a Newhall-Self Volcanic Explosivity Index from bulk ejecta volume in cubic meters, including the non-log-uniform VEI 0, 1, and 2 volume thresholds.",
  inputs: [
    {
      description: "Bulk ejecta volume (tephra) in cubic meters.",
      id: "bulkVolumeCubicMeters",
      kind: "number",
      label: "Bulk volume",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Volcanic Explosivity Index, integer 0 to 8.",
      id: "vei",
      kind: "integer",
      label: "VEI",
    },
    {
      description: "Newhall-Self classification name.",
      id: "classification",
      kind: "string",
      label: "Classification",
    },
  ],
  calculate: (input) =>
    calculateVolcanicExplosivityIndexCalculator(
      input as unknown as VolcanicExplosivityIndexCalculatorInput,
    ),
});

export const runVolcanicExplosivityIndexCalculator =
  volcanicExplosivityIndexCalculatorTool.execute;
export default volcanicExplosivityIndexCalculatorTool;
