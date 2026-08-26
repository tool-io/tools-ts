import { describe, expect, it } from "vitest";
import { dominoRoutingDepthExample, runDominoRoutingDepth } from "./tool.js";

describe("Domino Routing Depth Calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDominoRoutingDepth(dominoRoutingDepthExample.input)).toEqual({
      ok: true,
      output: dominoRoutingDepthExample.output,
    });
  });

  it("uses half the shortest tenon length per workpiece", () => {
    expect(runDominoRoutingDepth({ tenonLengthMm: "20" })).toEqual({
      ok: true,
      output: { routingDepthMm: 10 },
    });
  });

  it("uses half the longest tenon length per workpiece", () => {
    expect(runDominoRoutingDepth({ tenonLengthMm: "140" })).toEqual({
      ok: true,
      output: { routingDepthMm: 70 },
    });
  });

  it("covers every documented tenon length", () => {
    for (const tenonLengthMm of [
      "20",
      "30",
      "40",
      "50",
      "80",
      "100",
      "140",
    ] as const) {
      const result = runDominoRoutingDepth({ tenonLengthMm });
      expect(result.ok).toBe(true);
    }
  });

  it("rejects unknown tenon lengths", () => {
    const result = runDominoRoutingDepth({ tenonLengthMm: "60" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.field).toBe("tenonLengthMm");
  });

  it("rejects numeric tenon lengths", () => {
    expect(runDominoRoutingDepth({ tenonLengthMm: 50 }).ok).toBe(false);
  });

  it("requires the tenon length", () => {
    expect(runDominoRoutingDepth({}).ok).toBe(false);
  });

  it("rejects unknown fields", () => {
    const result = runDominoRoutingDepth({
      extra: true,
      tenonLengthMm: "40",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0]?.code).toBe("unknown_field");
  });

  it("rejects non-object input", () => {
    expect(runDominoRoutingDepth("50").ok).toBe(false);
  });
});
