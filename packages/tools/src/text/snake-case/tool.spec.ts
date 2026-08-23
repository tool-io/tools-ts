import { describe, expect, it } from "vitest";
import { snakeCaseExample, calculateSnakeCase, runSnakeCase } from "./tool.js";

describe("text/snake-case", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSnakeCase(snakeCaseExample.input)).toEqual({
      ok: true,
      output: snakeCaseExample.output,
    });
  });
  it("splits acronyms followed by words", () => {
    const result = runSnakeCase({ text: "Parse HTTPResponse Body" });
    expect(
      result.ok && result.output.snakeCased === "parse_http_response_body",
    ).toBe(true);
  });

  it("collapses punctuation and trims separators", () => {
    expect(calculateSnakeCase({ text: "  hello, world!  " })).toEqual({
      snakeCased: "hello_world",
    });
  });
});
