import { describe, expect, it } from "vitest";
import {
  bottlesPerBarrelExample,
  bottlesPerBarrelTool,
  runBottlesPerBarrel,
} from "./tool.js";

describe("bottlesPerBarrelTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runBottlesPerBarrel(bottlesPerBarrelExample.input)).toEqual({
      ok: true,
      output: bottlesPerBarrelExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(bottlesPerBarrelExample))).toEqual(
      bottlesPerBarrelExample,
    );
    expect(bottlesPerBarrelTool.contractVersion).toBe(1);
    expect(bottlesPerBarrelTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runBottlesPerBarrel(null).ok).toBe(false);
    expect(
      runBottlesPerBarrel({
        ...bottlesPerBarrelExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("distinguishes bottle equivalents from completely filled bottles", () => {
    expect(
      runBottlesPerBarrel({
        barrelCount: 1,
        barrelVolumeLiters: 1,
        bottleMl: 750,
      }),
    ).toEqual({
      ok: true,
      output: { totalBottles: 1.33333333333, wholeBottles: 1 },
    });
  });
});
