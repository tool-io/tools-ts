import { describe, expect, it } from "vitest";

import { example, filterHackerNews } from "./tool.js";

const items = example.input.items;

describe("Hacker News filter", () => {
  it("executes its canonical example", () => {
    expect(filterHackerNews(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
  });

  it("distinguishes Ask HN, Show HN, and link stories", () => {
    expect(filterHackerNews({ items, storyKind: "ask" })).toMatchObject({
      ok: true,
      output: { items: [{ id: "1" }] },
    });
    expect(filterHackerNews({ items, storyKind: "show" })).toMatchObject({
      ok: true,
      output: { items: [{ id: "2" }] },
    });
    expect(filterHackerNews({ items, storyKind: "link" })).toMatchObject({
      ok: true,
      output: { items: [{ id: "3" }] },
    });
  });

  it("applies inclusive dates and comment thresholds", () => {
    expect(
      filterHackerNews({
        from: "2026-09-12T00:00:00.000Z",
        items,
        minimumComments: 20,
        to: "2026-09-12T23:59:59.999Z",
      }),
    ).toMatchObject({ ok: true, output: { items: [{ id: "2" }] } });
  });

  it("rejects malformed stories and reversed date ranges", () => {
    expect(filterHackerNews({ items: [{}] })).toMatchObject({ ok: false });
    expect(
      filterHackerNews({
        items: [
          {
            ...items[0],
            url: "javascript:alert(1)",
          },
        ],
      }),
    ).toMatchObject({ ok: false });
    expect(
      filterHackerNews({
        from: "2026-09-14T00:00:00.000Z",
        items,
        to: "2026-09-13T00:00:00.000Z",
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_date_range" }] },
      ok: false,
    });
  });
});
