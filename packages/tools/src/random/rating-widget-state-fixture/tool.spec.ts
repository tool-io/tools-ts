import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculateRatingWidgetStateFixture,
  runRatingWidgetStateFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculateRatingWidgetStateFixture, example);
    expect(runRatingWidgetStateFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, subdivisions: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "subdivisions", code: "invalid_field" }] },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    const { seed, ...input } = example.input;
    expect(tool.execute(input, { random: () => 0.5 })).toMatchObject({
      ok: true,
      output: {
        states: [
          {
            value: 1.5,
            whole: 1,
            fraction: 0.5,
            disabled: false,
            fills: [1, 0.5, 0],
          },
        ],
      },
    });
  });
});
