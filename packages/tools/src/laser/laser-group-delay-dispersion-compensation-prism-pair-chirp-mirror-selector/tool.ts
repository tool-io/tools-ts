import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type GddMethod =
  "none" | "chirped-mirrors" | "prism-pair" | "grating-pair";

export type GddSelectorInput = {
  readonly neededGddFs2: number;
  readonly chirpedMirrorCapacityFs2: number;
  readonly prismPairCapacityFs2: number;
};

export type GddSelectorOutput = {
  readonly method: GddMethod;
  readonly rationale: string;
};

const METHOD_NOTES: Record<GddMethod, string> = {
  none: "The requested GDD is zero, so this magnitude comparison does not select a compensator.",
  "chirped-mirrors":
    "The requested magnitude fits the supplied chirped-mirror capacity. Verify wavelength range, dispersion ripple, and number of bounces.",
  "prism-pair":
    "The request exceeds the supplied chirped-mirror capacity but fits the supplied prism-pair capacity. Verify material dispersion and available separation.",
  "grating-pair":
    "The request exceeds both supplied capacities; evaluate a grating pair or revise the compressor design. Wavelength, bandwidth, loss, and footprint still govern suitability.",
};

/**
 * Capacity-based compressor choice. The limits come from the candidate
 * designs supplied by the user rather than universal method thresholds.
 */
export const gddSelector = (input: GddSelectorInput): GddSelectorOutput => {
  const { neededGddFs2, chirpedMirrorCapacityFs2, prismPairCapacityFs2 } =
    input;
  if (!Number.isFinite(neededGddFs2))
    simpleError("neededGddFs2", "Required GDD must be a finite number.");
  if (
    !Number.isFinite(chirpedMirrorCapacityFs2) ||
    chirpedMirrorCapacityFs2 < 0
  )
    simpleError(
      "chirpedMirrorCapacityFs2",
      "Chirped-mirror capacity must be finite and non-negative.",
    );
  if (!Number.isFinite(prismPairCapacityFs2) || prismPairCapacityFs2 < 0)
    simpleError(
      "prismPairCapacityFs2",
      "Prism-pair capacity must be finite and non-negative.",
    );
  if (prismPairCapacityFs2 < chirpedMirrorCapacityFs2)
    simpleError(
      "prismPairCapacityFs2",
      "Prism-pair capacity must be at least the chirped-mirror capacity.",
    );
  const magnitude = Math.abs(neededGddFs2);
  const method =
    magnitude === 0
      ? ("none" as const)
      : magnitude <= chirpedMirrorCapacityFs2
        ? ("chirped-mirrors" as const)
        : magnitude <= prismPairCapacityFs2
          ? ("prism-pair" as const)
          : ("grating-pair" as const);
  return { method, rationale: METHOD_NOTES[method] };
};

export const gddSelectorExample = {
  input: {
    neededGddFs2: -800,
    chirpedMirrorCapacityFs2: 1000,
    prismPairCapacityFs2: 20000,
  },
  output: {
    method: "chirped-mirrors",
    rationale: METHOD_NOTES["chirped-mirrors"],
  },
} satisfies ToolExample<GddSelectorInput, GddSelectorOutput>;

export const gddSelectorTool = createSimpleTool({
  calculate: (input) =>
    gddSelector({
      chirpedMirrorCapacityFs2: input.chirpedMirrorCapacityFs2 as number,
      neededGddFs2: input.neededGddFs2 as number,
      prismPairCapacityFs2: input.prismPairCapacityFs2 as number,
    }),
  description:
    "Compare required group-delay dispersion with user-supplied chirped-mirror and prism-pair capacities to select a compressor family without assuming universal thresholds.",
  id: "laser/laser-group-delay-dispersion-compensation-prism-pair-chirp-mirror-selector",
  inputs: [
    {
      description:
        "Group-delay dispersion to compensate in fs² (negative for anomalous). Magnitude drives the choice.",
      id: "neededGddFs2",
      kind: "number",
      label: "Needed GDD",
      unit: "fs²",
    },
    {
      description:
        "Maximum GDD magnitude the candidate chirped-mirror design can supply.",
      id: "chirpedMirrorCapacityFs2",
      kind: "number",
      label: "Mirror capacity",
      minimum: 0,
      unit: "fs²",
    },
    {
      description:
        "Maximum GDD magnitude the candidate prism-pair design can supply.",
      id: "prismPairCapacityFs2",
      kind: "number",
      label: "Prism capacity",
      minimum: 0,
      unit: "fs²",
    },
  ],
  outputs: [
    {
      description: "First compressor family whose supplied capacity fits.",
      enum: ["none", "chirped-mirrors", "prism-pair", "grating-pair"],
      id: "method",
      kind: "string",
      label: "Method",
    },
    {
      description: "Why the method fits the magnitude.",
      id: "rationale",
      kind: "string",
      label: "Rationale",
    },
  ],
  title: "GDD Compensation Selector",
});
export const runGddSelector = gddSelectorTool.execute;
export default gddSelectorTool;

export { gddSelectorExample as example };
