import { describe, expect, it } from "vitest";
import { jsonApplyPatchExample, runJsonApplyPatch } from "./tool.js";

describe("json/apply-patch", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runJsonApplyPatch(jsonApplyPatchExample.input)).toEqual({
      ok: true,
      output: jsonApplyPatchExample.output,
    });
  });

  it("replaces the whole document from the root pointer", () => {
    const result = runJsonApplyPatch({
      document: '{"old":true}',
      patch: '[{"op":"add","path":"","value":[1,2]}]',
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(JSON.parse(result.output.result as string)).toEqual([1, 2]);
  });

  it("inserts and removes array elements by index", () => {
    const result = runJsonApplyPatch({
      document: "[10,20,30]",
      patch:
        '[{"op":"remove","path":"/0"},{"op":"add","path":"/1","value":99}]',
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(JSON.parse(result.output.result as string)).toEqual([20, 99, 30]);
  });

  it("rejects removing the whole document", () => {
    const result = runJsonApplyPatch({
      document: "1",
      patch: '[{"op":"remove","path":""}]',
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.issues[0]?.code).toBe("invalid_patch_target");
  });

  it("rejects unknown operations and missing paths", () => {
    expect(
      runJsonApplyPatch({
        document: "{}",
        patch: '[{"op":"copy","from":"/a","path":"/b"}]',
      }).ok,
    ).toBe(false);
    expect(
      runJsonApplyPatch({
        document: "{}",
        patch: '[{"op":"remove","path":"/missing"}]',
      }).ok,
    ).toBe(false);
  });

  it("rejects out-of-bounds array indices", () => {
    const result = runJsonApplyPatch({
      document: "[1]",
      patch: '[{"op":"replace","path":"/5","value":9}]',
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.issues[0]?.code).toBe("index_out_of_bounds");
  });

  it("rejects patches that are not operation arrays", () => {
    const result = runJsonApplyPatch({ document: "{}", patch: '{"op":"add"}' });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.error.issues[0]?.code).toBe("invalid_patch");
  });
});
