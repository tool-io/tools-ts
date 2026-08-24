import { describe, expect, it } from "vitest";
import {
  collationFormulaBuilderExample,
  runCollationFormulaBuilder,
} from "./tool.js";

describe("collation-formula-builder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCollationFormulaBuilder(collationFormulaBuilderExample.input),
    ).toEqual({ ok: true, output: collationFormulaBuilderExample.output });
  });

  it("reaches double-letter quires past the tenth position", () => {
    const result = runCollationFormulaBuilder({
      quireLeaves: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 8],
    });
    if (!result.ok) throw new Error("expected success");
    expect((result.output.formula as string).endsWith("+XI^8")).toBe(true);
    expect(result.output.totalLeaves as number).toBe(128);
  });

  it("rejects empty quire lists", () => {
    expect(runCollationFormulaBuilder({ quireLeaves: [] }).ok).toBe(false);
  });

  it("rejects non-integer quire sizes", () => {
    expect(runCollationFormulaBuilder({ quireLeaves: [7.5] }).ok).toBe(false);
    expect(runCollationFormulaBuilder({ quireLeaves: [7] }).ok).toBe(false);
  });
});
