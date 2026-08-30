import { describe, expect, it } from "vitest";
import {
  itgcDomainSplitExample,
  runItgcDomainSplit,
  splitItgcDomains,
} from "./tool.js";

describe("ITGC access change operations domain split", () => {
  it("reproduces its canonical example", () => {
    expect(runItgcDomainSplit(itgcDomainSplitExample.input)).toEqual({
      ok: true,
      output: itgcDomainSplitExample.output,
    });
  });

  it("recognizes complete domain coverage", () => {
    expect(
      splitItgcDomains({
        domainControls: ["access:a", "change:b", "operations:c"],
      }).complete,
    ).toBe(true);
  });

  it("keeps a control label containing additional colons", () => {
    expect(
      splitItgcDomains({ domainControls: ["operations:job:restart"] })
        .unmappedControls,
    ).toEqual([]);
  });

  it("rejects a label without a domain separator", () => {
    expect(runItgcDomainSplit({ domainControls: ["access"] })).toMatchObject({
      error: {
        issues: [{ code: "invalid_domain_control", field: "domainControls.0" }],
      },
      ok: false,
    });
  });
});
