import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied requirements and observations for procurement donor overlap.",
  expected: { id: "contractVendorIds", label: "Contract vendor IDs" },
  example: {
    expected: ["vendor-17", "vendor-22", "vendor-41"],
    observed: ["vendor-22", "vendor-90"],
  },
  id: "journalism/procurement-donor-overlap",
  observed: { id: "donorEmployerIds", label: "Donor employer IDs" },
  title: "Procurement Donor Overlap",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
