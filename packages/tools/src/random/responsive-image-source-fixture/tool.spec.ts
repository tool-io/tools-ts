import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateResponsiveImageSourceFixture,
  runResponsiveImageSourceFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateResponsiveImageSourceFixture, example);
    expect(runResponsiveImageSourceFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({ ...example.input, candidatesPerCase: 1 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "candidatesPerCase", code: "insufficient_candidates" },
        ],
      },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(tool.execute({ ...example.input, modes: ["valid"] })).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            srcset: "b.png 200w, a.png 100w",
            parserResult: {
              candidates: [
                { url: "b.png", descriptor: "200w", kind: "width", value: 200 },
                { url: "a.png", descriptor: "100w", kind: "width", value: 100 },
              ],
            },
            parserError: null,
          },
        ],
      },
    });
    expect(
      tool.execute({ ...example.input, modes: ["duplicate"] }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          { parserError: { field: "srcset", code: "duplicate_descriptor" } },
        ],
      },
    });
  });
});
