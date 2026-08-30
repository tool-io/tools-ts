import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FuturesConeRingsInput = {
  readonly centralScenario: string;
  readonly horizonLabels: ReadonlyArray<string>;
  readonly ringDescriptions: ReadonlyArray<string>;
  readonly ringLabels: ReadonlyArray<string>;
};

export type FuturesConeRingsOutput = {
  readonly expandedScenarios: ReadonlyArray<string>;
  readonly ringCount: number;
  readonly scenarioAssignments: ReadonlyArray<string>;
};

export const buildVorosFuturesConeRings = (
  input: FuturesConeRingsInput,
): FuturesConeRingsOutput => {
  if (
    typeof input.centralScenario !== "string" ||
    input.centralScenario.trim() === ""
  )
    simpleError(
      "centralScenario",
      "A central scenario is required.",
      "central_scenario_required",
    );
  if (!Array.isArray(input.ringLabels) || input.ringLabels.length === 0)
    simpleError(
      "ringLabels",
      "At least one ring label is required.",
      "ring_labels_required",
    );
  if (
    !Array.isArray(input.horizonLabels) ||
    input.horizonLabels.length !== input.ringLabels.length
  )
    simpleError(
      "horizonLabels",
      "Each ring must have one horizon label.",
      "horizons_length_mismatch",
    );
  if (
    !Array.isArray(input.ringDescriptions) ||
    input.ringDescriptions.length !== input.ringLabels.length
  )
    simpleError(
      "ringDescriptions",
      "Each ring must have one description.",
      "ring_descriptions_length_mismatch",
    );
  const ringLabels = input.ringLabels.map((ringLabel, index) => {
    if (typeof ringLabel !== "string" || ringLabel.trim() === "")
      simpleError(
        `ringLabels.${index}`,
        "Ring labels must be nonempty strings.",
        "invalid_ring_label",
      );
    return ringLabel.trim();
  });
  const horizonLabels = input.horizonLabels.map((horizonLabel, index) => {
    if (typeof horizonLabel !== "string" || horizonLabel.trim() === "")
      simpleError(
        `horizonLabels.${index}`,
        "Horizon labels must be nonempty strings.",
        "invalid_horizon_label",
      );
    return horizonLabel.trim();
  });
  const ringDescriptions = input.ringDescriptions.map((description, index) => {
    if (typeof description !== "string" || description.trim() === "")
      simpleError(
        `ringDescriptions.${index}`,
        "Ring descriptions must be nonempty strings.",
        "invalid_ring_description",
      );
    return description.trim();
  });
  const scenarioAssignments = ringLabels.map(
    (ringLabel, index) =>
      `${ringLabel} | ${horizonLabels[index]} | ${ringDescriptions[index]}`,
  );
  return {
    expandedScenarios: scenarioAssignments.map(
      (assignment) => `${input.centralScenario.trim()} — ${assignment}`,
    ),
    ringCount: ringLabels.length,
    scenarioAssignments,
  };
};

export const futuresConeRingsExample = {
  input: {
    centralScenario: "Demand grows steadily",
    horizonLabels: ["near", "far"],
    ringDescriptions: ["faster transition", "slower transition"],
    ringLabels: ["inner", "outer"],
  },
  output: {
    expandedScenarios: [
      "Demand grows steadily — inner | near | faster transition",
      "Demand grows steadily — outer | far | slower transition",
    ],
    ringCount: 2,
    scenarioAssignments: [
      "inner | near | faster transition",
      "outer | far | slower transition",
    ],
  },
} satisfies ToolExample<FuturesConeRingsInput, FuturesConeRingsOutput>;

export const futuresConeRingsTool = createSimpleTool({
  calculate: (input) =>
    buildVorosFuturesConeRings({
      centralScenario: input.centralScenario as string,
      horizonLabels: input.horizonLabels as string[],
      ringDescriptions: input.ringDescriptions as string[],
      ringLabels: input.ringLabels as string[],
    }),
  description:
    "Expand a central scenario across caller-supplied labeled cone rings, horizons, and descriptions.",
  id: "futurology/voros-futures-cone-expansion-rings-lookup",
  inputs: [
    { id: "centralScenario", kind: "string", label: "Central scenario" },
    { id: "horizonLabels", kind: "stringList", label: "Horizon labels" },
    { id: "ringDescriptions", kind: "stringList", label: "Ring descriptions" },
    { id: "ringLabels", kind: "stringList", label: "Ring labels" },
  ],
  outputs: [
    {
      id: "expandedScenarios",
      kind: "stringList",
      label: "Expanded scenarios",
    },
    { id: "ringCount", kind: "integer", label: "Expansion rings", minimum: 1 },
    {
      id: "scenarioAssignments",
      kind: "stringList",
      label: "Ring scenario assignments",
    },
  ],
  title: "Voros Futures Cone Expansion Rings Lookup",
});

export const runFuturesConeRings = futuresConeRingsTool.execute;
export default futuresConeRingsTool;
