import { describe, expect, it } from "vitest";
import { runWhiteGlueDurability, whiteGlueDurabilityExample } from "./tool.js";

describe("White Glue Durability Class", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runWhiteGlueDurability(whiteGlueDurabilityExample.input)).toEqual({
      ok: true,
      output: whiteGlueDurabilityExample.output,
    });
  });

  it("describes D2 as interior dry areas without boil water resistance", () => {
    expect(runWhiteGlueDurability({ durabilityClass: "D2" })).toEqual({
      ok: true,
      output: {
        boilWaterResistant: false,
        usageDescription: "interior dry areas",
      },
    });
  });

  it("describes D4 as exposed exterior with boil water resistance", () => {
    expect(runWhiteGlueDurability({ durabilityClass: "D4" })).toEqual({
      ok: true,
      output: {
        boilWaterResistant: true,
        usageDescription: "exposed exterior with brief water contact",
      },
    });
  });

  it("covers every documented durability class", () => {
    for (const durabilityClass of ["D2", "D3", "D4"] as const) {
      const result = runWhiteGlueDurability({ durabilityClass });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects lowercase class names", () => {
    const result = runWhiteGlueDurability({
      durabilityClass: "d3" as never,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("invalid_field");
  });

  it("rejects unknown classes", () => {
    expect(runWhiteGlueDurability({ durabilityClass: "D5" as never }).ok).toBe(
      false,
    );
  });

  it("requires the durability class", () => {
    expect(runWhiteGlueDurability({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runWhiteGlueDurability({
      durabilityClass: "D2",
      extra: 1,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runWhiteGlueDurability("D4").ok).toBe(false);
  });
});
