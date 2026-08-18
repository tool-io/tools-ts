import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateHaversineDistance,
  haversineDistanceExample,
  haversineDistanceTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateHaversineDistance>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Haversine Distance", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = haversineDistanceTool.execute(haversineDistanceExample.input);
    expect(result).toEqual({ ok: true, output: haversineDistanceExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(haversineDistanceTool.id).toBe("geo/haversine-distance");
    expect(validateToolContract(haversineDistanceTool)).toEqual([]);
  });

  it("yields zero for identical coordinates and handles poles", () => {
    const same = calculateHaversineDistance({
      from: { latitudeDeg: 10.5, longitudeDeg: -20.25 },
      to: { latitudeDeg: 10.5, longitudeDeg: -20.25 },
    });
    expect(same.ok).toBe(true);
    if (same.ok) expect(same.output.kilometers).toBe(0);
    const poleToPole = calculateHaversineDistance({
      from: { latitudeDeg: -90, longitudeDeg: 0 },
      to: { latitudeDeg: 90, longitudeDeg: 0 },
    });
    expect(poleToPole.ok).toBe(true);
    if (poleToPole.ok)
      // Half circumference of the mean-radius Earth, rounded.
      expect(poleToPole.output.kilometers).toBeCloseTo(
        Math.round(Math.PI * 6371.0088 * 100) / 100,
        2,
      );
  });

  it("rejects malformed coordinates", () => {
    expect(calculateHaversineDistance(null).ok).toBe(false);
    expect(issueCodes(calculateHaversineDistance({}))).toEqual([
      "from_required",
      "to_required",
    ]);
    expect(
      issueCodes(
        calculateHaversineDistance({
          from: { latitudeDeg: 91, longitudeDeg: 0 },
          to: { latitudeDeg: 0, longitudeDeg: 0 },
        }),
      ),
    ).toEqual(["latitudeDeg_invalid"]);
    expect(
      issueCodes(
        calculateHaversineDistance({
          from: { latitudeDeg: 0, longitudeDeg: "east" },
          to: { latitudeDeg: 0, longitudeDeg: 0 },
        }),
      ),
    ).toEqual(["longitudeDeg_invalid"]);
    expect(
      issueCodes(
        calculateHaversineDistance({
          from: { latitudeDeg: 0, longitudeDeg: 0, elevationM: 5 },
          to: { latitudeDeg: 0, longitudeDeg: 0 },
        }),
      ),
    ).toEqual(["unknown_field"]);
  });
});
