import { describe, expect, it } from "vitest";
import {
  calculateChecksumFixityComparator,
  checksumFixityComparatorExample,
  runChecksumFixityComparator,
} from "./tool.js";

describe("archival-studies/checksum-fixity-comparator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runChecksumFixityComparator(checksumFixityComparatorExample.input),
    ).toEqual({
      ok: true,
      output: checksumFixityComparatorExample.output,
    });
  });

  it("flags mismatched digests as a fixity failure", () => {
    const result = calculateChecksumFixityComparator({
      expectedChecksum: "d41d8cd98f00b204e9800998ecf8427e",
      actualChecksum: "d41d8cd98f00b204e9800998ecf8427f",
    });
    expect(result.match).toBe(false);
  });

  it("rejects empty checksum inputs", () => {
    expect(
      runChecksumFixityComparator({
        expectedChecksum: "   ",
        actualChecksum: "abc",
      }).ok,
    ).toBe(false);
    expect(
      runChecksumFixityComparator({
        expectedChecksum: "abc",
        actualChecksum: "",
      }).ok,
    ).toBe(false);
  });
});
