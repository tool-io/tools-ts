import { describe, expect, it } from "vitest";
import tool, {
  calculateNoRepeatPlaylistCycle,
  noRepeatPlaylistCycleExample as example,
} from "./tool.js";
import { snAuthoringSpecs } from "../m250-sampling-narrative-spec-support.js";

describe(tool.id, () => {
  snAuthoringSpecs(tool, calculateNoRepeatPlaylistCycle, example);
  it("independently checks cycle exhaustion, total caps, and cross-cycle cooldowns", () => {
    for (let seed = 0; seed < 8; seed += 1) {
      const result = tool.execute({ ...example.input, seed });
      if (!result.ok) throw new Error("Expected success");
      const ids = result.output.playlist.map((play) => play.item.id);
      expect(new Set(ids.slice(0, 3))).toEqual(new Set(["a", "b", "c"]));
      for (let i = 1; i < ids.length; i += 1)
        expect(ids[i]).not.toBe(ids[i - 1]);
      for (const id of ["a", "b", "c"])
        expect(ids.filter((value) => value === id).length).toBeLessThanOrEqual(
          2,
        );
      expect(result.output.playlist.map((play) => play.cycle)).toEqual([
        1, 1, 1, 2, 2,
      ]);
    }
  });
  it("backtracks from an initially blocked category ordering without relaxing constraints", () => {
    const { seed, ...input } = example.input;
    const result = calculateNoRepeatPlaylistCycle(
      {
        ...input,
        items: [input.items[0], input.items[2], input.items[1]],
        count: 3,
        categoryCooldown: 1,
      },
      { random: () => 0.99 },
    );
    if (!result.ok)
      throw new Error("Expected search to find a feasible ordering");
    expect(result.output.playlist.map((play) => play.item.id)).toEqual([
      "a",
      "b",
      "c",
    ]);
    expect(result.output.playlist.map((play) => play.item.category)).toEqual([
      "strings",
      "keys",
      "strings",
    ]);
  });
  it("returns a proven longest prefix only under the explicit prefix policy", () => {
    const input = {
      ...example.input,
      items: [example.input.items[0]],
      count: 2,
      maxPlaysPerItem: 5,
    };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "infeasible_playlist" }] },
    });
    expect(
      tool.execute({ ...input, feasibilityPolicy: "longest-prefix" }),
    ).toMatchObject({
      ok: true,
      output: {
        complete: false,
        playlist: [{ item: { id: "a" }, cycle: 1 }],
        finalHistory: ["a"],
      },
    });
  });
  it("applies history to both cycle state and repetition limits", () => {
    const result = tool.execute({
      ...example.input,
      history: ["a", "b", "c"],
      count: 3,
    });
    if (!result.ok) throw new Error("Expected continuation success");
    expect(result.output.playlist[0].item.id).not.toBe("c");
    expect(result.output.playlist.every((play) => play.cycle === 2)).toBe(true);
    expect(result.output.frequencies.map((row) => row.totalPlays)).toEqual([
      2, 2, 2,
    ]);
    expect(
      tool.execute({ ...example.input, history: ["a", "a"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "history", code: "invalid_history" }] },
    });
    expect(
      tool.execute({ ...example.input, history: ["unknown"] }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "history", code: "unknown_history_item" }] },
    });
  });
  it("supports unconstrained repeats only when explicitly selected and bounds requests", () => {
    expect(
      tool.execute({
        ...example.input,
        items: [example.input.items[0]],
        count: 3,
        itemCooldown: 0,
        maxPlaysPerItem: 3,
        cyclePolicy: "cooldown",
      }),
    ).toMatchObject({
      ok: true,
      output: {
        complete: true,
        playlist: [{ cycle: 0 }, { cycle: 0 }, { cycle: 0 }],
      },
    });
    expect(tool.execute({ ...example.input, count: 65 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        items: [example.input.items[0], example.input.items[0]],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "items", code: "duplicate_id" }] },
    });
  });
});
