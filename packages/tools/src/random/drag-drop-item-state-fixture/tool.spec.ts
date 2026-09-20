import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateDragDropItemStateFixture,
  runDragDropItemStateFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateDragDropItemStateFixture, example);
    expect(runDragDropItemStateFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        containers: [
          { id: "left", capacity: 0 },
          { id: "right", capacity: 1 },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "containers", code: "initial_capacity_exceeded" }],
      },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const result = tool.execute({
      ...example.input,
      containers: [
        { id: "left", capacity: 2 },
        { id: "right", capacity: 2 },
      ],
      moveCount: 1,
    });
    if (!result.ok) throw new Error("Expected move");
    expect(result.output.events[0]).toMatchObject({
      accepted: true,
      sourceId: "right",
      targetId: "left",
    });
    expect(result.output.final).toEqual([
      { id: "left", itemIds: ["a", "b"] },
      { id: "right", itemIds: [] },
    ]);
  });
});
