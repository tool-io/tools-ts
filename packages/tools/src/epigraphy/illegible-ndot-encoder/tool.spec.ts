import { describe, expect, it } from "vitest";
import {
  calculateIllegibleNdotEncoder,
  illegibleNdotEncoderExample,
  runIllegibleNdotEncoder,
} from "./tool.js";

describe("epigraphy/illegible-ndot-encoder", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runIllegibleNdotEncoder(illegibleNdotEncoderExample.input)).toEqual({
      ok: true,
      output: illegibleNdotEncoderExample.output,
    });
  });

  it("supports middle-dot series", () => {
    expect(
      calculateIllegibleNdotEncoder({ letterCount: 3, dotStyle: "middot" })
        .encoding,
    ).toBe("[\u00B7\u00B7\u00B7]");
  });

  it("encodes single-letter lacunae", () => {
    expect(calculateIllegibleNdotEncoder({ letterCount: 1 }).encoding).toBe(
      "[.]",
    );
  });

  it("rejects zero or negative counts", () => {
    expect(runIllegibleNdotEncoder({ letterCount: 0 }).ok).toBe(false);
    expect(runIllegibleNdotEncoder({ letterCount: -2 }).ok).toBe(false);
    expect(() => calculateIllegibleNdotEncoder({ letterCount: 2.5 })).toThrow();
  });
});
