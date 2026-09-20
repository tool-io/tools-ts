import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateTabLabelOverflowFixture,
  runTabLabelOverflowFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateTabLabelOverflowFixture, example);
    expect(runTabLabelOverflowFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, totalBudget: -1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "totalBudget", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute(
        {
          labels: [{ text: "🌙a", direction: "ltr" }],
          count: 1,
          labelLimit: 2,
          totalBudget: 2,
        },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        tabs: [{ codepoints: 2, displayLabel: "🌙a", active: true }],
        totalCodepoints: 2,
        overflow: false,
      },
    });
  });
});
