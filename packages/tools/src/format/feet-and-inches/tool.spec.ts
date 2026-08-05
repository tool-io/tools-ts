import { describe, expect, it } from "vitest";
import {
  feetAndInchesFormatterExample,
  formatFeetAndInches,
  runFeetAndInchesFormatter,
} from "./tool.js";

describe("Feet and Inches Formatter", () => {
  it.each([
    [70, `5'10"`],
    [66, `5'6"`],
    [-30, `-2'6"`],
  ] as const)("formats %s inches", (inches, text) =>
    expect(formatFeetAndInches(inches)).toBe(text),
  );
  it("publishes an executable example", () =>
    expect(
      runFeetAndInchesFormatter(feetAndInchesFormatterExample.input),
    ).toEqual({ ok: true, output: feetAndInchesFormatterExample.output }));
});
