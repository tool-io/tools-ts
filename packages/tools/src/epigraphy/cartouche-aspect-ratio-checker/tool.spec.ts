import { describe, expect, it } from "vitest";
import {
  cartoucheAspectRatioCheckerExample,
  runCartoucheAspectRatioChecker,
} from "./tool.js";

describe("cartouche-aspect-ratio-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCartoucheAspectRatioChecker(cartoucheAspectRatioCheckerExample.input),
    ).toEqual({
      ok: true,
      output: cartoucheAspectRatioCheckerExample.output,
    });
  });

  it("classifies equal sides as square", () => {
    const result = runCartoucheAspectRatioChecker({
      widthCm: 10,
      heightCm: 10,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.aspectRatio as number).toBe(1);
    expect(result.output.orientation as string).toBe("square");
  });

  it("rejects a zero width", () => {
    expect(
      runCartoucheAspectRatioChecker({ widthCm: 0, heightCm: 10 }).ok,
    ).toBe(false);
  });
});
