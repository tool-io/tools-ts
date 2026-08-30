import { describe, expect, it } from "vitest";
import {
  buildDiegeticFutureArtifact,
  diegeticArtifactExample,
  runDiegeticArtifact,
} from "./tool.js";

describe("design fiction diegetic artifact builder", () => {
  it("reproduces its canonical example", () => {
    expect(runDiegeticArtifact(diegeticArtifactExample.input)).toEqual({
      ok: true,
      output: diegeticArtifactExample.output,
    });
  });

  it("uses the material and need in the artifact name", () => {
    expect(
      buildDiegeticFutureArtifact({
        constraint: "C",
        futureContext: "F",
        material: "wood",
        userNeed: "signal status",
      }).artifactName,
    ).toBe("signal status wood artifact");
  });

  it("makes the constraint visible in the principle", () => {
    expect(
      buildDiegeticFutureArtifact({
        constraint: "power is scarce",
        futureContext: "F",
        material: "glass",
        userNeed: "N",
      }).designPrinciple,
    ).toContain("power is scarce");
  });

  it("rejects an empty material", () => {
    expect(
      runDiegeticArtifact({
        constraint: "C",
        futureContext: "F",
        material: " ",
        userNeed: "N",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "artifact_field_required", field: "material" }],
      },
      ok: false,
    });
  });
});
