import { describe, expect, it } from "vitest";
import {
  unixTimestampToDateExample,
  calculateUnixTimestampToDate,
  runUnixTimestampToDate,
} from "./tool.js";

describe("convert/unix-timestamp-to-date", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runUnixTimestampToDate(unixTimestampToDateExample.input)).toEqual({
      ok: true,
      output: unixTimestampToDateExample.output,
    });
  });
  it("rejects invalid input (out_of_range)", () => {
    expect(runUnixTimestampToDate({ unixSeconds: 9000000000000 }).ok).toBe(
      false,
    );
  });
  it("maps the epoch itself to 1970-01-01", () => {
    const result = runUnixTimestampToDate({ unixSeconds: 0 });
    expect(result.ok && result.output.date).toBe("1970-01-01");
  });
});
