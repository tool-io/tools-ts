import { describe, expect, it } from "vitest";
import { invalidInput } from "../core/result.js";
import { SimpleToolError } from "../core/simple.js";
import {
  coreOutput,
  distanceFromCore,
  ensureOutput,
  objectSchema,
  numberSchema,
} from "./m250-css-music-space-support.js";

describe("M250 CSS/music/space support failure boundaries", () => {
  it("forwards documented core input issues with explicit field mapping", () => {
    try {
      coreOutput(
        invalidInput([
          {
            field: "trackWidth",
            code: "positive_width",
            message: "Positive width required.",
          },
        ]),
        { trackWidth: "minimumTrackPx" },
      );
      throw new Error("Expected issue");
    } catch (error) {
      expect(error).toBeInstanceOf(SimpleToolError);
      if (!(error instanceof SimpleToolError)) throw error;
      expect(error.field).toBe("minimumTrackPx");
      expect(error.code).toBe("positive_width");
    }
  });
  it("throws unexpected legacy failures and missing issues without relabeling", () => {
    for (const result of [
      invalidInput([]),
      invalidInput([
        {
          field: "",
          code: "calculation_failed",
          message: "Broken calculation.",
        },
      ]),
      invalidInput([
        { field: "output", code: "invalid_output", message: "Broken output." },
      ]),
    ]) {
      try {
        coreOutput(result);
        throw new Error("Expected core failure");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).not.toBeInstanceOf(SimpleToolError);
        expect(String(error)).toContain("reused core failed unexpectedly");
      }
    }
  });
  it("separates schema programming bugs from explicit numerical and resource limits", () => {
    const schema = objectSchema({ value: numberSchema });
    expect(() => ensureOutput({ wrong: 3 }, schema)).toThrow("does not match");
    try {
      ensureOutput({ value: Infinity }, schema);
      throw new Error("Expected numeric failure");
    } catch (error) {
      expect(error).toBeInstanceOf(SimpleToolError);
      if (!(error instanceof SimpleToolError)) throw error;
      expect(error.code).toBe("numeric_range");
    }
    try {
      ensureOutput({ text: "a".repeat(65537) }, schema);
      throw new Error("Expected budget failure");
    } catch (error) {
      expect(error).toBeInstanceOf(SimpleToolError);
      if (!(error instanceof SimpleToolError)) throw error;
      expect(error.code).toBe("output_resource_limit");
    }
  });
  it("delegates normalized geometry without squaring huge coordinates", () => {
    expect(
      distanceFromCore(
        { x: 0, y: 0, z: 0 },
        { x: 3e200, y: 4e200, z: 0 },
        "x",
      ) / 1e200,
    ).toBeCloseTo(5, 14);
    expect(
      distanceFromCore(
        { x: 0, y: 0, z: 0 },
        { x: 3e-200, y: 4e-200, z: 0 },
        "x",
      ),
    ).toBeCloseTo(5e-200, 210);
  });
});
