import { describe, expect, it } from "vitest";
import tool, {
  calculateStratifiedRowSample,
  stratifiedRowSampleExample as example,
} from "./tool.js";
import { snAuthoringSpecs } from "../m250-sampling-narrative-spec-support.js";

describe(tool.id, () => {
  snAuthoringSpecs(tool, calculateStratifiedRowSample, example);
  it("independently derives replacement inclusion and retains repeated original rows", () => {
    const { seed, ...base } = example.input;
    const result = calculateStratifiedRowSample(
      { ...base, quotas: [{ stratum: "north", count: 3, replacement: true }] },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.draws.map((draw) => draw.row.id)).toEqual([
      "n1",
      "n1",
      "n1",
    ]);
    // Of 2^3 equally likely draw sequences, exactly one misses a specified north row.
    expect(result.output.inclusion[0].probability).toBeCloseTo(7 / 8, 15);
    expect(result.output.inclusion[0].draws).toBe(3);
    expect(result.output.inclusion[2]).toMatchObject({
      probability: 0,
      quota: 0,
      draws: 0,
    });
  });
  it("honors exact quotas without replacement and reports every row", () => {
    const result = tool.execute({
      ...example.input,
      quotas: [{ stratum: "north", count: 2, replacement: false }],
    });
    if (!result.ok) throw new Error("Expected success");
    expect(new Set(result.output.draws.map((draw) => draw.row.id))).toEqual(
      new Set(["n1", "n2"]),
    );
    expect(result.output.inclusion.map((row) => row.probability)).toEqual([
      1, 1, 0,
    ]);
  });
  it("rejects absent/short strata and duplicate quota/row identities before drawing", () => {
    for (const quota of [
      { stratum: "north", count: 3, replacement: false },
      { stratum: "toString", count: 1, replacement: true },
    ])
      expect(tool.execute({ ...example.input, quotas: [quota] })).toMatchObject(
        {
          ok: false,
          error: { issues: [{ field: "quotas", code: "infeasible_stratum" }] },
        },
      );
    expect(
      tool.execute({
        ...example.input,
        quotas: [example.input.quotas[0], example.input.quotas[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "quotas", code: "duplicate_id" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        rows: [example.input.rows[0], example.input.rows[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "rows", code: "duplicate_id" }] },
    });
  });
  it("supports empty zero quotas and enforces combined output count bounds", () => {
    expect(
      tool.execute({
        rows: [],
        quotas: [{ stratum: "empty", count: 0, replacement: false }],
      }),
    ).toMatchObject({ ok: true, output: { draws: [], inclusion: [] } });
    expect(
      tool.execute({
        ...example.input,
        quotas: [
          { stratum: "north", count: 4096, replacement: true },
          { stratum: "south", count: 1, replacement: true },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "quotas", code: "resource_limit_exceeded" }] },
    });
  });
});
