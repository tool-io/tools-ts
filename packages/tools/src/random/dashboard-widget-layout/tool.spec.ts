import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  dashboardWidgetLayoutExample as example,
  calculateDashboardWidgetLayout,
} from "./tool.js";

describe("random/dashboard-widget-layout", () => {
  it("publishes the canonical direct and runner result and concrete contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    for (const result of [
      calculateDashboardWidgetLayout(example.input),
      tool.execute(example.input),
    ]) {
      if (!result.ok) throw new Error(JSON.stringify(result.error));
      expect(result.output).toEqual(example.output);
      expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(
        true,
      );
    }
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("preserves input, replays seeds, and gives an explicit seed precedence", () => {
    const input = JSON.parse(JSON.stringify(example.input));
    const before = JSON.stringify(input);
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(JSON.stringify(input)).toBe(before);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed wins");
        },
      }),
    ).toEqual(tool.execute(example.input));
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
    const result = tool.execute(unseeded, { random: () => 0.5 });
    if (!result.ok) throw new Error(JSON.stringify(result.error));
    expect(result.output.randomness).toEqual({ seed: null, source: "context" });
  });
  it("returns stable malformed-input and checked-source failures", () => {
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    const missing = tool.execute({});
    expect(missing).toMatchObject({
      ok: false,
      error: { code: "invalid_input" },
    });
    if (missing.ok)
      throw new Error("Expected every required-field diagnostic.");
    const requiredFields = [
      "rows",
      "columns",
      "widgets",
      "allowRotation",
      "maximumSearchNodes",
    ];
    expect(missing.error.issues).toHaveLength(requiredFields.length);
    expect(
      missing.error.issues.map(({ field, code }) => ({ field, code })),
    ).toEqual(
      expect.arrayContaining(
        requiredFields.map((field) => ({ field, code: "required_field" })),
      ),
    );
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "seed" }] },
    });
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_random_source", field: "random" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed source");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
  });
  it("independently reconstructs occupancy without overlaps", () => {
    const r = tool.execute(example.input);
    if (!r.ok) throw new Error("Expected packing");
    const cells = new Set<string>();
    for (const p of r.output.placements)
      for (let y = p.row; y < p.row + p.heightCells; y++)
        for (let x = p.column; x < p.column + p.widthCells; x++) {
          const key = x + "," + y;
          expect(cells.has(key)).toBe(false);
          cells.add(key);
        }
    expect(cells.size).toBe(4);
    expect(JSON.parse(r.output.occupancyJson)).toEqual(r.output.occupancy);
  });
  it("reports impossible areas, repeated IDs and an exhausted budget", () => {
    expect(tool.execute({ ...example.input, rows: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "infeasible_packing", field: "widgets" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        widgets: [example.input.widgets[0], example.input.widgets[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "duplicate_entries", field: "widgets" }] },
    });
    expect(
      tool.execute({ ...example.input, maximumSearchNodes: 1 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "search_exhausted", field: "maximumSearchNodes" }],
      },
    });
  });
});
