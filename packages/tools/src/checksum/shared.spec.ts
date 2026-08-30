import { describe, expect, it } from "vitest";
import adler32 from "./adler-32/tool.js";
import crc16 from "./crc-16-ccitt/tool.js";
import crc32 from "./crc-32/tool.js";

describe("checksum tools", () => {
  it.each([
    [crc16, "123456789", "29B1"],
    [crc32, "123456789", "CBF43926"],
    [adler32, "Wikipedia", "11E60398"],
  ])("calculates a canonical checksum", (tool, text, checksum) => {
    expect(tool.execute({ text })).toEqual({
      ok: true,
      output: { checksum },
    });
  });
});
