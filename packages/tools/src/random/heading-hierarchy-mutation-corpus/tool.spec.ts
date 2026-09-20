import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateHeadingHierarchyMutationCorpus,
  runHeadingHierarchyMutationCorpus,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateHeadingHierarchyMutationCorpus, example);
    expect(runHeadingHierarchyMutationCorpus(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        headings: [
          { level: 1, text: "A" },
          { level: 4, text: "B" },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "headings", code: "invalid_reference_hierarchy" }],
      },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const { seed, ...input } = example.input;
    expect(tool.execute(input, { random: () => 0 })).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            position: 1,
            levels: [1, 3, 3],
            check: { skippedAt: [1], hasUpwardSkips: true },
          },
        ],
      },
    });
  });
});
