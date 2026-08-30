import { describe, expect, it } from "vitest";
import {
  foresightDeliverableExample,
  lookupForesightDeliverable,
  runForesightDeliverable,
} from "./tool.js";

describe("foresight deliverable types report formats lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runForesightDeliverable(foresightDeliverableExample.input)).toEqual({
      ok: true,
      output: foresightDeliverableExample.output,
    });
  });

  it("looks up monitoring", () => {
    expect(
      lookupForesightDeliverable({ deliverableType: "monitoring" }).format,
    ).toContain("Indicator dashboard");
  });

  it("looks up roadmap", () => {
    expect(
      lookupForesightDeliverable({ deliverableType: "roadmap" }).cadence,
    ).toBe("Quarterly");
  });

  it("rejects an unsupported deliverable at the public boundary", () => {
    expect(
      runForesightDeliverable({ deliverableType: "forecast" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "deliverableType" }] },
      ok: false,
    });
  });
});
