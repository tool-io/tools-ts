import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateBreadcrumbDepthFixture,
  runBreadcrumbDepthFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateBreadcrumbDepthFixture, example);
    expect(runBreadcrumbDepthFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, minimumDepth: 4 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumDepth", code: "invalid_depth_range" }],
      },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute(
        { labels: ["Root"], minimumDepth: 1, maximumDepth: 1, labelLimit: 0 },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        crumbs: [
          { id: "crumb-0", parentId: null, current: true, displayLabel: "" },
        ],
      },
    });
  });
});
