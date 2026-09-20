import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateBadgeStatusCombinationFixture,
  runBadgeStatusCombinationFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateBadgeStatusCombinationFixture, example);
    expect(runBadgeStatusCombinationFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({ ...example.input, maximumCounter: -1 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumCounter", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const { seed, ...input } = example.input;
    expect(
      tool.execute(
        {
          ...input,
          count: 1,
          rules: [
            { label: "Ready", severity: "success", counterAllowed: false },
          ],
        },
        { random: () => 0.99 },
      ),
    ).toMatchObject({
      ok: true,
      output: { badges: [{ counter: null, severity: "success" }] },
    });
    expect(
      tool.execute(
        {
          ...input,
          count: 1,
          maximumCounter: 0,
          rules: [{ label: "Queued", severity: "info", counterAllowed: true }],
        },
        { random: () => 0 },
      ),
    ).toMatchObject({ ok: true, output: { badges: [{ counter: 0 }] } });
  });
});
