import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EcldConfig = "littrow" | "littman";

export type EcldConfigSelection = {
  readonly beamStaysFixedOnTuning: boolean;
  readonly typicalLinewidthKhz: number;
  readonly typicalCavityLengthMm: number;
  readonly note: string;
};

const CONFIGS: Readonly<Record<EcldConfig, Omit<EcldConfigSelection, never>>> =
  {
    littrow: {
      beamStaysFixedOnTuning: false,
      typicalLinewidthKhz: 200,
      typicalCavityLengthMm: 40,
      note: "The grating doubles as the end mirror, giving the shortest cavity; the output beam steers across the tuning range, so add a back-reflecting periscope if direction matters.",
    },
    littman: {
      beamStaysFixedOnTuning: true,
      typicalLinewidthKhz: 50,
      typicalCavityLengthMm: 100,
      note: "A fixed grating plus rotating retro-mirror keeps the output beam direction constant while tuning, at the cost of a longer cavity.",
    },
  };

export const selectEcldConfig = (config: EcldConfig): EcldConfigSelection => {
  const selection = CONFIGS[config];
  if (!selection)
    simpleError("config", "Choose either 'littrow' or 'littman'.");
  return selection;
};

export const ecldConfigSelectorExample = {
  input: { config: "littman" },
  output: CONFIGS.littman,
} satisfies ToolExample<{ config: EcldConfig }, EcldConfigSelection>;

export const ecldConfigSelectorTool = createSimpleTool({
  calculate: (input) => selectEcldConfig(input.config as EcldConfig),
  description:
    "Compare Littrow and Littman external-cavity diode laser configurations and return their beam-stability, linewidth, and cavity-length characteristics.",
  id: "laser/laser-external-cavity-diode-laser-littrow-littman-config-selector",
  inputs: [
    {
      description: "External-cavity architecture to inspect.",
      enum: ["littrow", "littman"],
      id: "config",
      kind: "string",
      label: "Configuration",
    },
  ],
  outputs: [
    {
      description: "Whether the output beam keeps its direction during tuning.",
      id: "beamStaysFixedOnTuning",
      kind: "boolean",
      label: "Beam stays fixed",
    },
    {
      description: "Representative linewidth achieved by the configuration.",
      id: "typicalLinewidthKhz",
      kind: "number",
      label: "Typical linewidth",
      unit: "kHz",
    },
    {
      description: "Representative external cavity length.",
      id: "typicalCavityLengthMm",
      kind: "number",
      label: "Cavity length",
      unit: "mm",
    },
    {
      description: "Mechanical trade-off of the configuration.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "ECDL Littrow/Littman Config Selector",
});
export const runEcldConfigSelector = ecldConfigSelectorTool.execute;
export default ecldConfigSelectorTool;

export { ecldConfigSelectorExample as example };
