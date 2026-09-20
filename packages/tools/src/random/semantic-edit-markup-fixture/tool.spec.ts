import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateSemanticEditMarkupFixture,
  runSemanticEditMarkupFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateSemanticEditMarkupFixture, example);
    expect(runSemanticEditMarkupFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, count: 33 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({
        ...example.input,
        fragments: [{ before: "A&B", after: "C<D" }],
        kinds: ["replacement"],
      }),
    ).toMatchObject({
      ok: true,
      output: {
        beforeText: "A&B",
        afterText: "C<D",
        html: '<del data-edit="0">A&amp;B</del><ins data-edit="0">C&lt;D</ins>',
      },
    });
    expect(
      tool.execute({ ...example.input, kinds: ["obsolete"] }),
    ).toMatchObject({
      ok: true,
      output: { beforeText: "Draft", afterText: "Draft" },
    });
  });
});
