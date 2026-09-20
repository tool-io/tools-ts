import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateAvatarGroupOverflowFixture,
  runAvatarGroupOverflowFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateAvatarGroupOverflowFixture, example);
    expect(runAvatarGroupOverflowFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(
      tool.execute({
        ...example.input,
        records: [{ name: " ", imageLabel: "" }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "records", code: "empty_name" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({
        ...example.input,
        count: 1,
        visibleLimit: 0,
        records: [{ name: "🌙 Q", imageLabel: "" }],
      }),
    ).toMatchObject({
      ok: true,
      output: {
        avatars: [{ initials: "🌙Q", imageLabel: null, visible: false }],
        visibleCount: 0,
        overflowCount: 1,
        overflowLabel: "+1",
      },
    });
  });
});
