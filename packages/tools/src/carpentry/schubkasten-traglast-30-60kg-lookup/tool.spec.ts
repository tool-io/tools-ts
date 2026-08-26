import { describe, expect, it } from "vitest";
import { drawerLoadClassExample, runDrawerLoadClass } from "./tool.js";

describe("Drawer Load Class Lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDrawerLoadClass(drawerLoadClassExample.input)).toEqual({
      ok: true,
      output: drawerLoadClassExample.output,
    });
  });

  it("rates the light class at 30 kilograms", () => {
    expect(runDrawerLoadClass({ loadClass: "light" })).toEqual({
      ok: true,
      output: { ratedLoadKg: 30 },
    });
  });

  it("rates the heavy class at 60 kilograms", () => {
    expect(runDrawerLoadClass({ loadClass: "heavy" })).toEqual({
      ok: true,
      output: { ratedLoadKg: 60 },
    });
  });

  it("covers every documented class", () => {
    for (const loadClass of ["light", "medium", "heavy"] as const) {
      const result = runDrawerLoadClass({ loadClass });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects unknown classes", () => {
    const result = runDrawerLoadClass({ loadClass: "ultra" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("loadClass");
  });

  it("rejects differently cased classes", () => {
    expect(runDrawerLoadClass({ loadClass: "Heavy" }).ok).toBe(false);
  });

  it("requires the load class", () => {
    expect(runDrawerLoadClass({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runDrawerLoadClass({ extra: true, loadClass: "light" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runDrawerLoadClass(42).ok).toBe(false);
  });
});
