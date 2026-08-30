import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit conflict-map methodology and uncertainty disclosures.",
  expected: { id: "requiredDisclosures", label: "Required map disclosures" },
  example: {
    expected: ["alpha", "beta", "gamma"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "journalism/conflict-map-disclosure",
  observed: { id: "publishedDisclosures", label: "Published disclosures" },
  title: "Conflict Map Disclosure",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
