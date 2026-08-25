import { describe, expect, it } from "vitest";
import {
  conidiophoreBranchingClassifierExample,
  runConidiophoreBranchingClassifier,
} from "./tool.js";

describe("Conidiophore Branching", () => {
  it("matches the canonical example", () => {
    expect(
      runConidiophoreBranchingClassifier(
        conidiophoreBranchingClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: conidiophoreBranchingClassifierExample.output,
    });
  });
  it("passes through unbranched", () =>
    expect(
      runConidiophoreBranchingClassifier({ branching: "unbranched" }),
    ).toMatchObject({ ok: true, output: { branchingClass: "unbranched" } }));
  it("passes through sympodial", () =>
    expect(
      runConidiophoreBranchingClassifier({ branching: "sympodial" }),
    ).toMatchObject({ ok: true, output: { branchingClass: "sympodial" } }));
  it("passes through monopodial", () =>
    expect(
      runConidiophoreBranchingClassifier({ branching: "monopodial" }),
    ).toMatchObject({ ok: true, output: { branchingClass: "monopodial" } }));
  it("passes through verticillate", () =>
    expect(
      runConidiophoreBranchingClassifier({ branching: "verticillate" }),
    ).toMatchObject({ ok: true, output: { branchingClass: "verticillate" } }));
  it("rejects unknown patterns", () =>
    expect(
      runConidiophoreBranchingClassifier({
        branching: "dichotomous",
      } as unknown as { branching: "penicillate" }).ok,
    ).toBe(false));
  it("requires the branching field", () =>
    expect(
      runConidiophoreBranchingClassifier(
        {} as unknown as { branching: "penicillate" },
      ).ok,
    ).toBe(false));
});
