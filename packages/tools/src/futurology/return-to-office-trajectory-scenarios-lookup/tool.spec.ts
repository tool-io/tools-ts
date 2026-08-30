import { describe, expect, it } from "vitest";
import {
  classifyReturnToOfficeTrajectory,
  returnToOfficeTrajectoryExample,
  runReturnToOfficeTrajectory,
} from "./tool.js";

describe("return-to-office trajectory scenarios lookup", () => {
  it("reproduces its canonical example", () => {
    expect(
      runReturnToOfficeTrajectory(returnToOfficeTrajectoryExample.input),
    ).toEqual({
      ok: true,
      output: returnToOfficeTrajectoryExample.output,
    });
  });

  it("classifies a remote-first trajectory", () => {
    expect(
      classifyReturnToOfficeTrajectory({
        collaborationDependencyPercent: 30,
        locationFlexibleTaskPercent: 80,
        mandatoryOfficeDaysPerWeek: 1,
      }).scenario,
    ).toBe("remoteFirst");
  });

  it("classifies an office-first trajectory", () => {
    expect(
      classifyReturnToOfficeTrajectory({
        collaborationDependencyPercent: 80,
        locationFlexibleTaskPercent: 20,
        mandatoryOfficeDaysPerWeek: 4,
      }).scenario,
    ).toBe("officeFirst");
  });

  it("rejects mandatory office days above seven", () => {
    expect(
      runReturnToOfficeTrajectory({
        collaborationDependencyPercent: 30,
        locationFlexibleTaskPercent: 80,
        mandatoryOfficeDaysPerWeek: 8,
      }),
    ).toMatchObject({
      error: {
        issues: [
          { code: "invalid_field", field: "mandatoryOfficeDaysPerWeek" },
        ],
      },
      ok: false,
    });
  });
});
