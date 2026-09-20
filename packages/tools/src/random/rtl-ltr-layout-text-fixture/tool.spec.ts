import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateRtlLtrLayoutTextFixture,
  runRtlLtrLayoutTextFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateRtlLtrLayoutTextFixture, example);
    expect(runRtlLtrLayoutTextFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, form: "NFCX" })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "form", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({
        ...example.input,
        texts: [{ text: "ﬁ & <x>", direction: "ltr" }],
        form: "NFKC",
        count: 1,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        spans: [{ original: "ﬁ & <x>", normalized: "fi & <x>" }],
        html: '<bdi dir="ltr">fi &amp; &lt;x&gt;</bdi>',
      },
    });
  });
});
