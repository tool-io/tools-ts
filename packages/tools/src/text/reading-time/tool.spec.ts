import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateReadingTime,
  readingTimeExample,
  readingTimeTool,
} from "./tool.js";

describe("Reading Time", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = readingTimeTool.execute(readingTimeExample.input);
    expect(result).toEqual({ ok: true, output: readingTimeExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(readingTimeTool.id).toBe("text/reading-time");
    expect(validateToolContract(readingTimeTool)).toEqual([]);
  });

  it("labels sub-minute reads in seconds and zero words as zero", () => {
    expect(calculateReadingTime({ words: 0 })).toMatchObject({
      output: { minutes: 0, roundedMinutes: 0, label: "0 sec read" },
    });
    expect(calculateReadingTime({ words: 50 })).toMatchObject({
      output: { minutes: 0.25 },
    });
  });

  it("scales with a custom pace", () => {
    const result = calculateReadingTime({
      words: 1000,
      wordsPerMinute: 250,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.minutes).toBe(4);
  });

  it("rejects malformed probes", () => {
    expect(calculateReadingTime(null).ok).toBe(false);
    expect(calculateReadingTime({})).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(calculateReadingTime({ words: -1 })).toMatchObject({
      error: { code: "invalid_input" },
    });
    expect(
      calculateReadingTime({ words: 10, wordsPerMinute: 59 }),
    ).toMatchObject({ error: { code: "invalid_input" } });
    expect(
      calculateReadingTime({ extra: true, words: 10 }),
    ).toMatchObject({ error: { code: "invalid_input" } });
  });
});
