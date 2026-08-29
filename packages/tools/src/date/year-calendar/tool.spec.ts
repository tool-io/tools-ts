import { describe, expect, it } from "vitest";
import tool, { example } from "./tool.js";

it("matches the canonical date/year-calendar result", () =>
  expect(tool.execute(example.input)).toEqual({
    ok: true,
    output: example.output,
  }));
describe("year calendar", () => {
  it("creates twelve months", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(
        (result.output.months as { months: unknown[] }).months,
      ).toHaveLength(12);
  });
  it("highlights a week spanning two months in both month grids", () => {
    const result = tool.execute({ year: 2024, currentWeekDate: "2024-02-01" });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const months = (
      result.output.months as {
        months: { weeks: { highlighted: boolean }[] }[];
      }
    ).months;
    expect(months[0]!.weeks.at(-1)!.highlighted).toBe(true);
    expect(months[1]!.weeks[0]!.highlighted).toBe(true);
  });
});
