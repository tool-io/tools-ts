import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const msMbExplosionDiscriminationNoteLookupExample = {
  input: { surfaceMagnitudeMs: 4, bodyMagnitudeMb: 5.2 },
  output: {
    msMinusMb: 4.0 - 5.2,
    sourceHint: "mb-rich: explosion-like signature",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const msMbExplosionDiscriminationNoteLookupTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ surfaceMagnitudeMs, bodyMagnitudeMb }) => {
      const d = surfaceMagnitudeMs - bodyMagnitudeMb;
      return {
        msMinusMb: d,
        sourceHint:
          d < -0.5
            ? "mb-rich: explosion-like signature"
            : d > 0.5
              ? "Ms-rich: earthquake-like signature"
              : "ambiguous band; gather more phases",
      };
    })(input as never) as Record<string, unknown>,
  description: "First-order Ms/mb discrimination screen for event source type.",
  id: "seismology/ms-mb-explosion-discrimination-note-lookup",
  inputs: [
    {
      description: "Surface-wave magnitude.",
      id: "surfaceMagnitudeMs",
      kind: "number",
      label: "Ms",
    },
    {
      description: "Body-wave magnitude.",
      id: "bodyMagnitudeMb",
      kind: "number",
      label: "mb",
    },
  ],
  outputs: [
    {
      description: "Ms − mb discriminant.",
      id: "msMinusMb",
      kind: "number",
      label: "Δ",
    },
    {
      description: "Source-type hint from the discriminant.",
      id: "sourceHint",
      kind: "string",
      label: "Hint",
    },
  ],
  title: "MS MB Explosion Discrimination Note Lookup",
});
export const runMsMbExplosionDiscriminationNoteLookup =
  msMbExplosionDiscriminationNoteLookupTool.execute;
export { msMbExplosionDiscriminationNoteLookupExample as example };
export default msMbExplosionDiscriminationNoteLookupTool;
