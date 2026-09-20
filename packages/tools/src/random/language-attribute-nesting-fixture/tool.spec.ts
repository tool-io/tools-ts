import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateLanguageAttributeNestingFixture,
  runLanguageAttributeNestingFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateLanguageAttributeNestingFixture, example);
    expect(runLanguageAttributeNestingFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, tags: ["en\n"] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "tags", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const draws = [0, 0, 0, 0, 0.99, 0];
    const { seed, ...input } = example.input;
    expect(
      tool.execute(input, { random: () => draws.shift() ?? 0 }),
    ).toMatchObject({
      ok: true,
      output: {
        nodes: [
          { explicitLanguage: "en", effectiveLanguage: "en" },
          { explicitLanguage: "fr", effectiveLanguage: "fr" },
        ],
      },
    });
  });
});
