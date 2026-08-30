import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type IlluminanceFromFluxInput = Readonly<{
  readonly incidentLumens: number;
  readonly areaSquareMeters: number;
}>;
export type IlluminanceFromFluxOutput = Readonly<{
  readonly illuminanceLux: number;
}>;

export const calculateIlluminanceFromFlux = (
  x: IlluminanceFromFluxInput,
): IlluminanceFromFluxOutput => {
  if (!Number.isFinite(x.incidentLumens) || x.incidentLumens < 0)
    simpleError("incidentLumens", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.areaSquareMeters) || x.areaSquareMeters < 0)
    simpleError("areaSquareMeters", "Provide a finite number at least 0.");
  const illuminanceLux = x.incidentLumens / x.areaSquareMeters;
  if (!Number.isFinite(illuminanceLux))
    simpleError(
      "illuminanceLux",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { illuminanceLux: Object.is(illuminanceLux, -0) ? 0 : illuminanceLux };
};

export const example = {
  input: { incidentLumens: 1000, areaSquareMeters: 10 },
  output: { illuminanceLux: 100 },
} satisfies ToolExample<IlluminanceFromFluxInput, IlluminanceFromFluxOutput>;

export const tool = createSimpleTool({
  id: "engineering/illuminance-from-flux",
  title: "Illuminance From Flux",
  description:
    "Average illuminance in lux from uniformly distributed luminous flux incident on a surface area.",
  inputs: [
    {
      id: "incidentLumens",
      kind: "number",
      label: "Incident Lumens",
      unit: "lm",
      minimum: 0,
    },
    {
      id: "areaSquareMeters",
      kind: "number",
      label: "Area Square Meters",
      unit: "m²",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "illuminanceLux",
      kind: "number",
      label: "Illuminance Lux",
      unit: "lx",
    },
  ],
  calculate: (input) =>
    calculateIlluminanceFromFlux({
      incidentLumens: input.incidentLumens as number,
      areaSquareMeters: input.areaSquareMeters as number,
    }),
});
export const illuminanceFromFluxTool = tool;
export const runIlluminanceFromFlux = tool.execute;
export default tool;
