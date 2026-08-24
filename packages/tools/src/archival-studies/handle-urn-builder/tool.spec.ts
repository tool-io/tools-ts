import { describe, expect, it } from "vitest";
import {
  calculateHandleUrnBuilder,
  handleUrnBuilderExample,
  runHandleUrnBuilder,
} from "./tool.js";

describe("archival-studies/handle-urn-builder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runHandleUrnBuilder(handleUrnBuilderExample.input)).toEqual({
      ok: true,
      output: handleUrnBuilderExample.output,
    });
  });

  it("accepts legacy numeric prefixes and dotted sub-namespaces", () => {
    expect(
      calculateHandleUrnBuilder({ prefix: "12345", suffix: "a/b.c" }),
    ).toEqual({
      handle: "12345/a/b.c",
      hdlUri: "hdl:12345/a/b.c",
      resolverUrl: "https://hdl.handle.net/12345/a/b.c",
    });
  });

  it("rejects non-numeric prefixes and whitespace suffixes", () => {
    expect(runHandleUrnBuilder({ prefix: "hdl-20", suffix: "x" }).ok).toBe(
      false,
    );
    expect(
      runHandleUrnBuilder({ prefix: "20.1000", suffix: "two words" }).ok,
    ).toBe(false);
  });
});
