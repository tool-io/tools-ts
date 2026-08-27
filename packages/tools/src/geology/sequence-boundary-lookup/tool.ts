import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SequenceBoundaryLookupInput = {
  readonly observedFeature: string;
};

export type SequenceBoundaryLookupOutput = {
  readonly diagnosticWeight: string;
  readonly position: string;
  readonly interpretation: string;
};

const FEATURES: Record<
  string,
  { diagnosticWeight: string; position: string; interpretation: string }
> = {
  "erosional-truncation": {
    diagnosticWeight: "diagnostic",
    position: "below the boundary",
    interpretation:
      "Erosional truncation of underlying strata is a primary criterion for a sequence boundary formed during relative sea-level fall.",
  },
  "subaerial-exposure": {
    diagnosticWeight: "diagnostic",
    position: "at the boundary",
    interpretation:
      "Subaerial exposure (paleosols, rootlets, karst, meteoric diagenesis) marks the basinward shift caused by a relative sea-level fall.",
  },
  "downward-shift-coastal-onlap": {
    diagnosticWeight: "diagnostic",
    position: "above the boundary",
    interpretation:
      "A downward shift in coastal onlap records forced regression and is a defining expression of a sequence boundary.",
  },
  "onlap-above": {
    diagnosticWeight: "supporting",
    position: "above the boundary",
    interpretation:
      "Renewed onlap above the surface records the following transgression; supportive but not unique to sequence boundaries.",
  },
  "incised-valley-fill": {
    diagnosticWeight: "supporting",
    position: "above the boundary",
    interpretation:
      "Incised-valley fill resting on the erosion surface supports a sequence-boundary interpretation where correlated regionally.",
  },
  toplap: {
    diagnosticWeight: "related",
    position: "below the boundary",
    interpretation:
      "Toplap below the surface reflects stillstand in the highstand systems tract; by itself it does not diagnose the boundary.",
  },
};

export const calculateSequenceBoundaryLookup = (
  input: SequenceBoundaryLookupInput,
): SequenceBoundaryLookupOutput => {
  const entry = FEATURES[input.observedFeature];
  if (entry === undefined)
    simpleError(
      "observedFeature",
      "Unknown observed feature; pick one from the supported list.",
      "unknown_feature",
    );
  return {
    diagnosticWeight: entry.diagnosticWeight,
    position: entry.position,
    interpretation: entry.interpretation,
  };
};

export const sequenceBoundaryLookupExample = {
  input: { observedFeature: "subaerial-exposure" },
  output: {
    diagnosticWeight: "diagnostic",
    position: "at the boundary",
    interpretation:
      "Subaerial exposure (paleosols, rootlets, karst, meteoric diagenesis) marks the basinward shift caused by a relative sea-level fall.",
  },
} satisfies ToolExample<
  SequenceBoundaryLookupInput,
  SequenceBoundaryLookupOutput
>;

export const sequenceBoundaryLookupTool = createSimpleTool({
  id: "geology/sequence-boundary-lookup",
  title: "Sequence Boundary Lookup",
  description:
    "Assess how strongly an observed stratigraphic feature indicates a sequence boundary, and on which side of the surface it occurs.",
  inputs: [
    {
      description: "Observed seismic or outcrop feature.",
      enum: Object.keys(FEATURES),
      id: "observedFeature",
      kind: "string",
      label: "Observed feature",
    },
  ],
  outputs: [
    {
      description:
        "Strength of evidence for a sequence boundary: diagnostic, supporting, or related.",
      id: "diagnosticWeight",
      kind: "string",
      label: "Evidence",
    },
    {
      description:
        "Position of the feature relative to the candidate boundary.",
      id: "position",
      kind: "string",
      label: "Position",
    },
    {
      description:
        "Interpretation of the feature in sequence-stratigraphic terms.",
      id: "interpretation",
      kind: "string",
      label: "Interpretation",
    },
  ],
  calculate: (input) =>
    calculateSequenceBoundaryLookup(
      input as unknown as SequenceBoundaryLookupInput,
    ),
});

export const runSequenceBoundaryLookup = sequenceBoundaryLookupTool.execute;
export default sequenceBoundaryLookupTool;
