import { describe, expect, it } from "vitest";
import {
  lookupPunkFuturesGenre,
  punkFuturesExample,
  runPunkFutures,
} from "./tool.js";

describe("punk genre futures lookup", () => {
  it("reproduces its canonical example", () => {
    expect(runPunkFutures(punkFuturesExample.input)).toEqual({
      ok: true,
      output: punkFuturesExample.output,
    });
  });

  it("looks up cyberpunk", () => {
    expect(lookupPunkFuturesGenre({ genre: "cyberpunk" }).designCues).toContain(
      "corporate power",
    );
  });

  it("looks up steampunk", () => {
    expect(lookupPunkFuturesGenre({ genre: "steampunk" }).blindSpot).toContain(
      "extraction",
    );
  });

  it("rejects an unsupported genre at the public boundary", () => {
    expect(runPunkFutures({ genre: "biopunk" })).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "genre" }] },
      ok: false,
    });
  });
});
