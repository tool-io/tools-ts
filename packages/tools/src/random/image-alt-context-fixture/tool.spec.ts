import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateImageAltContextFixture,
  runImageAltContextFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateImageAltContextFixture, example);
    expect(runImageAltContextFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        images: [{ description: "Map", context: "unknown" }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "images", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({
        ...example.input,
        images: [{ description: "A & B", context: "informative" }],
        modes: ["contextual"],
        count: 1,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            alt: "A & B",
            html: '<img alt="A &amp; B">',
            presence: { present: true, emptyAlternative: false },
          },
        ],
      },
    });
  });
});
