import { describe, expect, it } from "vitest";
import { glueLineSpecExample, runGlueLineSpec } from "./tool.js";

describe("Glue Line Spec Check", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runGlueLineSpec(glueLineSpecExample.input)).toEqual({
      ok: true,
      output: glueLineSpecExample.output,
    });
  });

  it("accepts the 0.1 millimetre lower boundary", () => {
    expect(runGlueLineSpec({ glueLineMm: 0.1 })).toEqual({
      ok: true,
      output: { isWithinSpec: true },
    });
  });

  it("accepts the 0.3 millimetre upper boundary", () => {
    expect(runGlueLineSpec({ glueLineMm: 0.3 })).toEqual({
      ok: true,
      output: { isWithinSpec: true },
    });
  });

  it("fails just below the specification", () => {
    expect(runGlueLineSpec({ glueLineMm: 0.09 })).toEqual({
      ok: true,
      output: { isWithinSpec: false },
    });
  });

  it("fails just above the specification", () => {
    expect(runGlueLineSpec({ glueLineMm: 0.31 })).toEqual({
      ok: true,
      output: { isWithinSpec: false },
    });
  });

  it("fails a starved zero glue line", () => {
    expect(runGlueLineSpec({ glueLineMm: 0 })).toEqual({
      ok: true,
      output: { isWithinSpec: false },
    });
  });

  it("fails a two millimetre glue line", () => {
    expect(runGlueLineSpec({ glueLineMm: 2 })).toEqual({
      ok: true,
      output: { isWithinSpec: false },
    });
  });

  it("rejects negative thicknesses", () => {
    const result = runGlueLineSpec({ glueLineMm: -0.1 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects thickness above two millimetres", () => {
    expect(runGlueLineSpec({ glueLineMm: 2.5 }).ok).toBe(false);
  });

  it("requires the glue line thickness", () => {
    expect(runGlueLineSpec({}).ok).toBe(false);
  });
});
