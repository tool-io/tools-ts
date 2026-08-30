import { describe, expect, it } from "vitest";
import { loadToolModule } from "../registry.js";

const variants = [
  "adler-32",
  "fletcher-16",
  "internet-16",
  "lrc-8",
  "xor-8",
  "crc-8",
  "crc-8-autosar",
  "crc-8-maxim-dow",
  "crc-8-sae-j1850",
  "crc-16-arc",
  "crc-16-ccitt",
  "crc-16-dnp",
  "crc-16-kermit",
  "crc-16-modbus",
  "crc-16-usb",
  "crc-16-x-25",
  "crc-16-xmodem",
  "crc-24-openpgp",
  "crc-32",
  "crc-32-bzip2",
  "crc-32-jamcrc",
  "crc-32-koopman",
  "crc-32-mpeg-2",
  "crc-32-posix",
  "crc-32c",
  "crc-32q",
  "crc-64-ecma-182",
  "crc-64-go-iso",
  "crc-64-we",
  "crc-64-xz",
  "crc-custom",
];

describe("checksum variants", () => {
  it("matches the catalogue check value for 123456789", async () => {
    for (const variant of variants) {
      const module = await loadToolModule(`checksum/${variant}`);
      expect(module, variant).toBeDefined();
      const result = module!.default.execute(module!.example!.input);
      expect(result, variant).toEqual({
        ok: true,
        output: module!.example!.output,
      });
    }
  });
});
