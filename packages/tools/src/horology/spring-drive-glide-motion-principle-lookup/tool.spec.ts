import { describe, expect, it } from "vitest";
import {
  lookupSpringDrivePrinciple,
  runSpringDrive,
  springDriveExample,
} from "./tool.js";

describe("Spring Drive glide-motion principle lookup", () => {
  it("reproduces the canonical continuous-motion statement", () => {
    expect(runSpringDrive(springDriveExample.input)).toEqual({
      ok: true,
      output: springDriveExample.output,
    });
  });

  it("keeps the mainspring energy source", () => {
    expect(
      lookupSpringDrivePrinciple({ principleFocus: "energy" })
        .verifiedStatement,
    ).toContain("mainspring powered");
  });

  it("describes the Tri-synchro regulator", () => {
    expect(
      lookupSpringDrivePrinciple({ principleFocus: "regulator" }).keyDate,
    ).toBe("Tri-synchro regulator");
  });

  it("positions Spring Drive as a hybrid technology", () => {
    expect(
      lookupSpringDrivePrinciple({ principleFocus: "hybridPosition" })
        .verifiedStatement,
    ).toContain("electronic regulator");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runSpringDrive({ principleFocus: "kinetic" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "principleFocus" }] },
      ok: false,
    });
  });
});
