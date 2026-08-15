import { describe, expect, it } from "vitest";
import {
  ascii85Codec,
  base122Codec,
  base32Codec,
  base58Codec,
  base91Codec,
  createBitCodec,
  createBlockCodec,
  createRadixCodec,
  uuDecode,
  uuEncode,
  z85Codec,
} from "./basen.js";
import { utf8Decode, utf8Encode as utf8 } from "./encoding.js";

describe("createBitCodec", () => {
  it("encodes RFC 4648 Base32 test vectors", () => {
    expect(base32Codec.encode([])).toBe("");
    expect(base32Codec.encode(utf8("f"))).toBe("MY======");
    expect(base32Codec.encode(utf8("fo"))).toBe("MZXQ====");
    expect(base32Codec.encode(utf8("foo"))).toBe("MZXW6===");
    expect(base32Codec.encode(utf8("foob"))).toBe("MZXW6YQ=");
    expect(base32Codec.encode(utf8("fooba"))).toBe("MZXW6YTB");
    expect(base32Codec.encode(utf8("foobar"))).toBe("MZXW6YTBOI======");
  });
  it("decodes canonical Base32", () => {
    expect(base32Codec.decode("KRXW63BONFXQ====")).toEqual(utf8("Tool.io"));
  });
  it("rejects characters outside the alphabet", () => {
    expect(() => base32Codec.decode("my======")).toThrow();
    expect(() => base32Codec.decode("MZXW8===")).toThrow();
  });
  it("rejects misplaced or oversized padding", () => {
    expect(() => base32Codec.decode("MZXW6=TB")).toThrow();
    expect(() => base32Codec.decode("========")).toThrow();
    expect(() => base32Codec.decode("MY=====")).toThrow();
  });
  it("rejects non-canonical trailing bits", () => {
    expect(() => base32Codec.decode("MZ======")).toThrow();
  });
  it("supports unpadded power-of-two alphabets such as hexadecimal", () => {
    const codec = createBitCodec({
      alphabet: "0123456789ABCDEF",
      bitsPerChar: 4,
    });
    expect(codec.encode([0xde, 0xad])).toBe("DEAD");
    expect(codec.decode("DEAD")).toEqual([0xde, 0xad]);
    expect(codec.encode([0xd])).toBe("0D");
  });
});

describe("createRadixCodec", () => {
  it("encodes canonical Base58 with Bitcoin alphabet", () => {
    expect(base58Codec.encode([])).toBe("");
    expect(base58Codec.encode(utf8("Hello World!"))).toBe("2NEpo7TZRRrLZSi2U");
    expect(base58Codec.encode(utf8("hello world"))).toBe("StV1DL6CwTryKyV");
  });
  it("preserves leading zero bytes", () => {
    expect(base58Codec.encode([0])).toBe("1");
    expect(base58Codec.encode([0, 0])).toBe("11");
    expect(base58Codec.encode([0, 0, 1])).toBe("112");
    expect(base58Codec.decode("112")).toEqual([0, 0, 1]);
  });
  it("round trips large values through BigInt arithmetic", () => {
    const bytes = [255, 254, 253, 128, 1, 0, 250];
    expect(base58Codec.decode(base58Codec.encode(bytes))).toEqual(bytes);
  });
  it("rejects ambiguous characters outside the alphabet", () => {
    expect(() => base58Codec.decode("0OIl")).toThrow();
  });
  it("supports alphabets without a leading zero rule", () => {
    const codec = createRadixCodec({
      alphabet: "0123456789abcdef",
    });
    expect(codec.encode([0xde, 0xad])).toBe("dead");
    expect(codec.decode("dead")).toEqual([0xde, 0xad]);
    expect(codec.decode("")).toEqual([]);
  });
});

describe("createBlockCodec with Ascii85", () => {
  it("encodes full and partial groups", () => {
    expect(ascii85Codec.encode([])).toBe("");
    expect(ascii85Codec.encode(utf8("Man "))).toBe("9jqo^");
    expect(ascii85Codec.encode(utf8("Man is"))).toBe("9jqo^Bla");
    expect(ascii85Codec.encode(utf8("Hello, World!"))).toBe(
      "87cURD_*#4DfTZ)+T",
    );
  });
  it("compresses full zero groups and encodes partial zeros", () => {
    expect(ascii85Codec.encode([0, 0, 0, 0])).toBe("z");
    expect(ascii85Codec.encode([0, 0, 0, 0, 0, 0, 0, 0])).toBe("zz");
    expect(ascii85Codec.encode([0])).toBe("!!");
    expect(ascii85Codec.encode([0, 0])).toBe("!!!");
    expect(ascii85Codec.encode([0, 0, 0])).toBe("!!!!");
  });
  it("decodes canonical Ascii85 including zero compression", () => {
    expect(ascii85Codec.decode("9jqo^")).toEqual(utf8("Man "));
    expect(ascii85Codec.decode("<,Z\\k/no5")).toEqual(utf8("Tool.io"));
    expect(ascii85Codec.decode("z")).toEqual([0, 0, 0, 0]);
  });
  it("rejects overflowing groups and malformed structure", () => {
    expect(() => ascii85Codec.decode("uuuuu")).toThrow();
    expect(() => ascii85Codec.decode("!")).toThrow();
    expect(() => ascii85Codec.decode("z!")).toThrow();
  });
});

describe("createBlockCodec with Z85", () => {
  it("encodes the specification example", () => {
    expect(z85Codec.encode([0x86, 0x4f, 0xd2, 0x6f, 0xb5, 0x59, 0xf7, 0x5b]))
      .toBe("HelloWorld");
  });
  it("decodes the specification example", () => {
    expect(z85Codec.decode("HelloWorld")).toEqual([
      0x86, 0x4f, 0xd2, 0x6f, 0xb5, 0x59, 0xf7, 0x5b,
    ]);
  });
  it("requires byte-aligned input without partial groups", () => {
    expect(z85Codec.encode(utf8("Z85!"))).toBe("s#Xw.");
    expect(z85Codec.decode("s#Xw.")).toEqual(utf8("Z85!"));
    expect(() => z85Codec.encode(utf8("abc"))).toThrow();
    expect(() => z85Codec.decode("Hell")).toThrow();
  });
});

describe("codec configurations are isolated", () => {
  it("does not share state between codecs of one family", () => {
    const first = createBitCodec({
      alphabet: "0123456789ABCDEF",
      bitsPerChar: 4,
    });
    const second = createRadixCodec({ alphabet: "01" });
    expect(first.decode("FF")).toEqual([255]);
    expect(second.decode(second.encode([3]))).toEqual([3]);
  });
});

describe("base91Codec", () => {
  it("matches reference encoder vectors", () => {
    expect(base91Codec.encode([])).toBe("");
    expect(base91Codec.encode(utf8("f"))).toBe("LB");
    expect(base91Codec.encode(utf8("fo"))).toBe("drD");
    expect(base91Codec.encode(utf8("foobar"))).toBe("dr/2s)uC");
    expect(base91Codec.encode(utf8("Hello World!"))).toBe(">OwJh>Io0Tv!8PE");
    expect(base91Codec.encode(utf8("Tool.io"))).toBe("Lr.J7g${G");
  });
  it("decodes reference vectors including single-char flush", () => {
    expect(base91Codec.decode("")).toEqual([]);
    expect(base91Codec.decode("LB")).toEqual(utf8("f"));
    expect(base91Codec.decode(">OwJh>A")).toEqual(utf8("Hello"));
  });
  it("rejects characters outside the alphabet", () => {
    expect(() => base91Codec.decode("AA AA")).toThrow();
  });
  it("round trips deterministic byte arrays", () => {
    const bytes = Array.from({ length: 64 }, (_, i) => (i * 37) % 256);
    expect(base91Codec.decode(base91Codec.encode(bytes))).toEqual(bytes);
  });
});

describe("uuEncode and uuDecode", () => {
  it("encodes canonical uu bodies with space zero groups", () => {
    expect(uuEncode([])).toBe("");
    expect(uuEncode([65])).toBe("!00  ");
    expect(uuEncode(utf8("a"))).toBe("!80  ");
    expect(uuEncode(utf8("ab"))).toBe('"86( ');
    expect(uuEncode(utf8("abc"))).toBe("#86)C");
    expect(uuEncode(utf8("Tool.io"))).toBe("'5&]O;\"YI;P  ");
  });
  it("splits lines at the configured byte count", () => {
    const bytes = Array.from({ length: 48 }, (_, i) => (i * 37) % 256);
    expect(uuEncode(bytes)).toBe(
      'M "5*;Y2YW@,H37*7O.$&*U!UFK_D"2Y3>)W"YPPQ5GN@Q>H/-%E^H\\CM$C=<\n#@:;+',
    );
    expect(uuEncode([65], 1)).toBe("!00  ");
  });
  it("decodes space and backtick zero groups plus trailing newline", () => {
    expect(uuDecode("'5&]O;\"YI;P  ")).toEqual(utf8("Tool.io"));
    expect(uuDecode("'5&]O;\"YI;P``")).toEqual(utf8("Tool.io"));
    expect(uuDecode("#86)C\n")).toEqual(utf8("abc"));
    expect(uuDecode("")).toEqual([]);
  });
  it("rejects malformed bodies", () => {
    expect(() => uuDecode("~86)C")).toThrow();
    expect(() => uuDecode("#86)")).toThrow();
    expect(() => uuDecode("`")).toThrow();
    expect(() => uuDecode("#86)C\n\n!80  ")).toThrow();
  });
});

describe("base122Codec", () => {
  it("encodes reference artifacts as UTF-8 text", () => {
    expect(base122Codec.encode(utf8(""))).toEqual([]);
    expect(base122Codec.encode(utf8("Hello"))).toEqual([
      ...utf8("$\u0019-Fc<"),
    ]);
    expect(base122Codec.encode(utf8('say "hi" & bye\\'))).toEqual([
      ...utf8("9X/\u0012\u0001\tPi\u0011\b\u0004b\u0003\tre.\u0780"),
    ]);
  });
  it("decodes reference artifacts", () => {
    expect(base122Codec.decode(utf8("$\u0019-Fc<"))).toEqual(utf8("Hello"));
    expect(base122Codec.decode(utf8("*\u001bmva9Ro"))).toEqual(utf8("Tool.io"));
    expect(
      base122Codec.decode(utf8("6\u001a-f)D\u0014l4[LS\u00104\u0014")),
    ).toEqual(utf8("line1\nline2\r\n"));
  });
  it("round trips a corpus covering escape sequences", () => {
    for (let seed = 0; seed < 24; seed += 1) {
      const bytes = Array.from({ length: (seed * 13) % 100 }, (_, i) =>
        (seed * 61 + i * 97) % 256,
      );
      const artifact = utf8Decode(base122Codec.encode(bytes));
      expect(base122Codec.decode(utf8(artifact))).toEqual(bytes);
    }
  });
  it("rejects malformed sequences", () => {
    expect(() => base122Codec.decode([0x80])).toThrow();
    expect(() => base122Codec.decode([0xc2])).toThrow();
    expect(() => base122Codec.decode([...utf8("$\u0019"), 0xff])).toThrow();
  });
});
