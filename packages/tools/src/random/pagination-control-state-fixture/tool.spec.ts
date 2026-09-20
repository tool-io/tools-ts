import { describe, it, expect } from "vitest";
import tool, {
  example,
  calculatePaginationControlStateFixture,
  runPaginationControlStateFixture,
} from "./index.js";
import {
  canonical,
  boundaries,
  replay,
} from "../m500b-ui-accessibility-test-support.js";
describe(tool.id, () => {
  it("lightweight canonical, schema, contract and index runner", () => {
    canonical(tool, calculatePaginationControlStateFixture, example);
    expect(runPaginationControlStateFixture(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });
  it("lightweight complete missing fields and code boundaries", () => {
    boundaries(tool, example.input);
    expect(tool.execute({ ...example.input, minimumItems: 10 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "maximumItems", code: "invalid_item_range" }],
      },
    });
  });
  it("lightweight replay, seed precedence, source failures and immutability", () =>
    replay(tool, example.input));
  it("lightweight independent model case", () => {
    expect(
      tool.execute({ ...example.input, minimumItems: 0, maximumItems: 0 }),
    ).toMatchObject({
      ok: true,
      output: {
        states: [
          {
            pageCount: 0,
            currentPage: 0,
            previousDisabled: true,
            nextDisabled: true,
            firstItem: 0,
            lastItem: 0,
            label: "Page 0/0",
          },
        ],
      },
    });
    const { seed, ...input } = example.input;
    expect(
      tool.execute(
        {
          ...input,
          minimumItems: Number.MAX_SAFE_INTEGER,
          maximumItems: Number.MAX_SAFE_INTEGER,
          pageSize: Number.MAX_SAFE_INTEGER,
        },
        { random: () => 0 },
      ),
    ).toMatchObject({
      ok: true,
      output: {
        states: [
          {
            pageCount: 1,
            currentPage: 1,
            firstItem: 1,
            lastItem: Number.MAX_SAFE_INTEGER,
          },
        ],
      },
    });
  });
});
