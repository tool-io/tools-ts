import { describe, expect, it } from "vitest";
import {
  sclerotiumSizeClassRaterExample,
  sclerotiumSizeClassRaterTool,
  runSclerotiumSizeClassRater,
} from "./tool.js";

describe("Sclerotium Size Class", () => {
  const boundaries = {
    largeMinimumMm: 20.1,
    mediumMinimumMm: 5.1,
    microsclerotiumMaximumMm: 0.49,
  };
  it("executes its canonical example to the exact published output", () => {
    expect(
      runSclerotiumSizeClassRater(sclerotiumSizeClassRaterExample.input),
    ).toEqual({
      ok: true,
      output: sclerotiumSizeClassRaterExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(sclerotiumSizeClassRaterExample))).toEqual(
      sclerotiumSizeClassRaterExample,
    );
    expect(sclerotiumSizeClassRaterTool.contractVersion).toBe(1);
    expect(sclerotiumSizeClassRaterTool.execution).toEqual({ kind: "pure" });
  });

  it("classes diameters under 0.5 mm as microsclerotium", () => {
    for (const diameter of [0.1, 0.49]) {
      const result = runSclerotiumSizeClassRater({
        ...boundaries,
        diameterMm: diameter,
      });
      expect(result.ok).toBe(true);
      if (result.ok)
        expect(result.output.sclerotiumSizeClass).toBe("microsclerotium");
    }
  });

  it("classes diameters up to 5 mm as small at the boundary", () => {
    const result = runSclerotiumSizeClassRater({
      ...boundaries,
      diameterMm: 5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.sclerotiumSizeClass).toBe("small");
  });

  it("classes diameters up to 20 mm as medium and beyond as large", () => {
    const medium = runSclerotiumSizeClassRater({
      ...boundaries,
      diameterMm: 20,
    });
    expect(medium.ok).toBe(true);
    if (medium.ok) expect(medium.output.sclerotiumSizeClass).toBe("medium");
    const large = runSclerotiumSizeClassRater({
      ...boundaries,
      diameterMm: 20.5,
    });
    expect(large.ok).toBe(true);
    if (large.ok) expect(large.output.sclerotiumSizeClass).toBe("large");
  });

  it("rejects non-positive diameters", () => {
    expect(
      runSclerotiumSizeClassRater({ ...boundaries, diameterMm: 0 }).ok,
    ).toBe(false);
    expect(
      runSclerotiumSizeClassRater({ ...boundaries, diameterMm: -3 }).ok,
    ).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runSclerotiumSizeClassRater(null).ok).toBe(false);
    expect(
      runSclerotiumSizeClassRater({ ...boundaries, diameterMm: "12" }).ok,
    ).toBe(false);
    expect(
      runSclerotiumSizeClassRater({
        ...sclerotiumSizeClassRaterExample.input,
        size: 1,
      }).ok,
    ).toBe(false);
  });
  it("rejects unordered boundaries", () =>
    expect(
      runSclerotiumSizeClassRater({
        diameterMm: 12,
        largeMinimumMm: 5,
        mediumMinimumMm: 10,
        microsclerotiumMaximumMm: 1,
      }).ok,
    ).toBe(false));
});
