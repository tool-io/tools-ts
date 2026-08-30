import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for tughra marker match.",
  expected: { id: "catalogMarkers", label: "Catalog markers" },
  example: {
    expected: ["loop", "beyze", "tuğ"],
    observed: ["loop", "beyze", "unknown"],
  },
  id: "numismatics/tughra-marker-match",
  observed: { id: "observedMarkers", label: "Observed markers" },
  title: "Tughra Marker Match",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
