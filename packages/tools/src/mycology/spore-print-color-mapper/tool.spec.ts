import { describe, expect, it } from "vitest";
import {
  runSporePrintColorMapper,
  sporePrintColorMapperExample,
} from "./tool.js";

describe("Spore Print Color Mapper", () => {
  it("matches the canonical example", () => {
    expect(
      runSporePrintColorMapper(sporePrintColorMapperExample.input),
    ).toEqual({
      ok: true,
      output: sporePrintColorMapperExample.output,
    });
  });
  it("records cream", () =>
    expect(runSporePrintColorMapper({ color: "cream" })).toEqual({
      ok: true,
      output: { printColor: "cream" },
    }));
  it("records green without inventing a taxonomic group", () =>
    expect(runSporePrintColorMapper({ color: "green" })).toEqual({
      ok: true,
      output: { printColor: "green" },
    }));
  it("records pink", () =>
    expect(runSporePrintColorMapper({ color: "pink" })).toEqual({
      ok: true,
      output: { printColor: "pink" },
    }));
  it("records purple-brown", () =>
    expect(runSporePrintColorMapper({ color: "purple-brown" })).toEqual({
      ok: true,
      output: { printColor: "purple-brown" },
    }));
  it("records rust-brown", () =>
    expect(runSporePrintColorMapper({ color: "rust-brown" })).toEqual({
      ok: true,
      output: { printColor: "rust-brown" },
    }));
  it("records black", () =>
    expect(runSporePrintColorMapper({ color: "black" })).toEqual({
      ok: true,
      output: { printColor: "black" },
    }));
  it("rejects unknown colors", () =>
    expect(
      (runSporePrintColorMapper({ color: "blue" }) as { ok: boolean }).ok,
    ).toBe(false));
});
