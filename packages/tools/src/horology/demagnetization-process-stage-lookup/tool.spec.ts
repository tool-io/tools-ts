import { describe, expect, it } from "vitest";
import {
  demagnetizationProcessExample,
  lookupDemagnetizationProcess,
  runDemagnetizationProcess,
} from "./tool.js";

describe("demagnetization process-stage lookup", () => {
  it("reproduces the canonical pass-count example", () => {
    expect(
      runDemagnetizationProcess(demagnetizationProcessExample.input),
    ).toEqual({
      ok: true,
      output: demagnetizationProcessExample.output,
    });
  });

  it("covers field decay", () => {
    expect(
      lookupDemagnetizationProcess({ processFocus: "fieldDecay" }).keyConcern,
    ).toContain("decreasing alternating field");
  });

  it("covers post-process verification", () => {
    expect(
      lookupDemagnetizationProcess({ processFocus: "verification" }).keyConcern,
    ).toContain("Verify timekeeping");
  });

  it("keeps mechanical faults separate from magnetism", () => {
    expect(
      lookupDemagnetizationProcess({ processFocus: "limitations" }).keyConcern,
    ).toContain("separate mechanical fault");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(
      runDemagnetizationProcess({ processFocus: "coilCurrent" }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "processFocus" }] },
      ok: false,
    });
  });
});
