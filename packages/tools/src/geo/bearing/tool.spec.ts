import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateGeoBearing,
  geoBearingExample,
  geoBearingTool,
} from "./tool.js";

describe("Compass Bearing", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = geoBearingTool.execute(geoBearingExample.input);
    expect(result).toEqual({ ok: true, output: geoBearingExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(geoBearingTool.id).toBe("geo/bearing");
    expect(validateToolContract(geoBearingTool)).toEqual([]);
  });

  it("returns cardinal directions for aligned points", () => {
    const east = calculateGeoBearing({
      from: { latitudeDeg: 0, longitudeDeg: 0 },
      to: { latitudeDeg: 0, longitudeDeg: 10 },
    });
    expect(east.ok).toBe(true);
    if (east.ok) expect(east.output.bearingDegrees).toBe(90);
    const north = calculateGeoBearing({
      from: { latitudeDeg: 10, longitudeDeg: 0 },
      to: { latitudeDeg: 20, longitudeDeg: 0 },
    });
    expect(north.ok).toBe(true);
    if (north.ok) expect(north.output.bearingDegrees).toBe(0);
    const south = calculateGeoBearing({
      from: { latitudeDeg: 20, longitudeDeg: 0 },
      to: { latitudeDeg: 10, longitudeDeg: 0 },
    });
    expect(south.ok).toBe(true);
    if (south.ok) expect(south.output.bearingDegrees).toBe(180);
  });

  it("rejects malformed coordinates", () => {
    expect(calculateGeoBearing(null).ok).toBe(false);
    expect(calculateGeoBearing({})).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(
      calculateGeoBearing({
        from: { latitudeDeg: -91, longitudeDeg: 0 },
        to: { latitudeDeg: 0, longitudeDeg: 0 },
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateGeoBearing({
        extra: true,
        from: { latitudeDeg: 0, longitudeDeg: 0 },
        to: { latitudeDeg: 0, longitudeDeg: 0 },
      }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
