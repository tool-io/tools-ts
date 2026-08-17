import { describe, expect, it } from "vitest";
import { validateToolContract } from "./core/contract.js";

const tools = {
  "encode/base32": await import("./encode/base32/tool.js"),
  "decode/base32": await import("./decode/base32/tool.js"),
  "encode/run-length": await import("./encode/run-length/tool.js"),
  "decode/run-length": await import("./decode/run-length/tool.js"),
  "encode/html-entities": await import("./encode/html-entities/tool.js"),
  "decode/html-entities": await import("./decode/html-entities/tool.js"),
} as const;

describe("Encoding family", () => {
  for (const [id, module] of Object.entries(tools)) {
    it(`${id} publishes a valid contract and executes its example`, () => {
      const tool = module.default;
      expect(tool.id).toBe(id);
      expect(validateToolContract(tool)).toEqual([]);
      const result = tool.execute(module.example.input);
      expect(result).toEqual({ ok: true, output: module.example.output });
    });
  }

  it("round-trips base32", async () => {
    const encode = tools["encode/base32"].default;
    const decode = tools["decode/base32"].default;
    for (const text of ["a", "ab", "abc", "Hello!", "any carnal pleasure"]) {
      const encoded = encode.execute({ text }) as unknown as {
        output: { encoded: string };
      };
      expect(
        decode.execute({ base32: encoded.output.encoded }),
      ).toEqual({ ok: true, output: { text } });
    }
  });

  it("rejects invalid base32 characters", () => {
    expect(
      tools["decode/base32"].default.execute({ encoded: "hello1" }),
    ).toMatchObject({ ok: false });
  });

  it("round-trips run-length encoding", async () => {
    const encode = tools["encode/run-length"].default;
    const decode = tools["decode/run-length"].default;
    const original = "wwwwaaadexxxxxx";
    const encoded = encode.execute({ text: original }) as unknown as {
      output: { encoded: string };
    };
    expect(encoded.output.encoded).toBe("w4a3d1e1x6");
    expect(
      decode.execute({ encoded: encoded.output.encoded }),
    ).toEqual({ ok: true, output: { text: original } });
  });

  it("decodes numeric HTML entities too", () => {
    expect(
      tools["decode/html-entities"].default.execute({
        text: "&#72;&#101;llo &copy-free &#x41;",
      }),
    ).toMatchObject({ output: { text: "Hello &copy-free A" } });
  });
});
