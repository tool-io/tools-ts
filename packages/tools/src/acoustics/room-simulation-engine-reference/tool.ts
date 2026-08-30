import { createReferenceLookup } from "../../core/reference.js";

const reference = createReferenceLookup({
  description:
    "Compare broad capabilities of established geometric room-acoustics engines without claiming result equivalence.",
  entries: {
    scope: {
      source: "Current vendor documentation, accessed 2026-09-24",
      statement:
        "ODEON, CATT-Acoustic, and EASE provide geometric-acoustics room simulation with differing workflows, algorithms, databases, and licensing.",
    },
    validation: {
      source: "ISO 3382 metrics and vendor guidance",
      statement:
        "Model results depend on geometry, scattering, absorption, source directivity, receiver setup, and calibration against measurements.",
    },
    caution: {
      source: "Vendor documentation",
      statement:
        "Engine names alone do not establish accuracy or interchangeability; compare the exact version, settings, and validation case.",
    },
  },
  exampleTopic: "scope",
  id: "acoustics/room-simulation-engine-reference",
  title: "Room Simulation Engine Reference",
});

export type Input = Parameters<typeof reference.lookup>[0];
export type Output = ReturnType<typeof reference.lookup>;
export const example = reference.example;
export const lookupReference = reference.lookup;
export const tool = reference.tool;
export const runReference = reference.run;
export default tool;
