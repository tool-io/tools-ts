import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const kovesligethyIntensityDecayIsoseismalExample = {
  input: { epicentralIntensityI0: 8, targetIntensity: 5, focalDepthKm: 10 },
  output: {
    isoseismalRadiusKm: 99.498743710662,
    decayNote: "Valid for shallow crustal events with macroseismic data only.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const kovesligethyIntensityDecayIsoseismalTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ epicentralIntensityI0, targetIntensity, focalDepthKm }) => {
      if (targetIntensity > epicentralIntensityI0)
        simpleError("targetIntensity", "Target intensity cannot exceed I₀.");
      const ratio = Math.pow(10, (epicentralIntensityI0 - targetIntensity) / 3);
      if (ratio <= 1)
        simpleError("focalDepthKm", "Choose a target intensity below I₀.");
      return {
        isoseismalRadiusKm: focalDepthKm * Math.sqrt(ratio * ratio - 1),
        decayNote:
          "Valid for shallow crustal events with macroseismic data only.",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Kövesligethy isoseismal radius: I(r) = I₀ − 3·log₁₀(√(r²+h²)/h), inverted for a target intensity.",
  id: "seismology/kovesligethy-intensity-decay-isoseismal",
  inputs: [
    {
      description: "Epicentral intensity.",
      id: "epicentralIntensityI0",
      kind: "number",
      label: "I₀",
    },
    {
      description: "Isoseismal of interest.",
      id: "targetIntensity",
      kind: "number",
      label: "I",
    },
    {
      minimum: 0,
      description: "Focal depth.",
      id: "focalDepthKm",
      kind: "number",
      label: "h",
      unit: "km",
    },
  ],
  outputs: [
    {
      description: "Radius of the target isoseismal.",
      id: "isoseismalRadiusKm",
      kind: "number",
      label: "r_I",
      unit: "km",
    },
    {
      description: "Validity note.",
      id: "decayNote",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Kovesligethy Intensity Decay Isoseismal Calculator",
});
export const runKovesligethyIntensityDecayIsoseismal =
  kovesligethyIntensityDecayIsoseismalTool.execute;
export { kovesligethyIntensityDecayIsoseismalExample as example };
export default kovesligethyIntensityDecayIsoseismalTool;
