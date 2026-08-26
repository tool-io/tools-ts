import { describe, expect, it } from "vitest";
import {
  calculateMigrationEffectivenessIndexEm,
  runMigrationEffectivenessIndexEm,
  migrationEffectivenessIndexEmExample,
} from "./tool.js";

describe("demography/migration-effectiveness-index-em", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMigrationEffectivenessIndexEm(
        migrationEffectivenessIndexEmExample.input,
      ),
    ).toEqual({
      ok: true,
      output: migrationEffectivenessIndexEmExample.output,
    });
  });

  it("is zero for perfectly balanced exchanges and one for one-way flow", () => {
    const balanced = calculateMigrationEffectivenessIndexEm({
      streams: [
        [0, 10],
        [10, 0],
      ],
    });
    expect(balanced.effectivenessIndex).toBe(0);
    const oneWay = calculateMigrationEffectivenessIndexEm({
      streams: [
        [0, 10],
        [0, 0],
      ],
    });
    expect(oneWay.effectivenessIndex).toBe(1);
  });

  it("rejects empty or non-positive matrices", () => {
    expect(runMigrationEffectivenessIndexEm({ streams: [] }).ok).toBe(false);
    expect(
      runMigrationEffectivenessIndexEm({
        streams: [
          [0, 0],
          [0, 0],
        ],
      }).ok,
    ).toBe(false);
  });
});
