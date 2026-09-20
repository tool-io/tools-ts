import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateModalStackStateFixture,
  runModalStackStateFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateModalStackStateFixture, example);
    expect(runModalStackStateFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, eventCount: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "eventCount", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const draws = [0.4, 0, 0.4, 0, 0];
    const { seed, ...input } = example.input;
    expect(
      tool.execute(
        { ...input, eventCount: 3 },
        { random: () => draws.shift() ?? 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        events: [
          { action: "open", parentId: null },
          { action: "open", parentId: "modal-0" },
          {
            action: "close",
            targetId: "modal-1",
            accepted: true,
            stack: ["modal-0"],
          },
        ],
        finalStack: ["modal-0"],
      },
    });
  });
});
