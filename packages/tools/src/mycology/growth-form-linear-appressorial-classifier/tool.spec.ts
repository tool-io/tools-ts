import { describe, expect, it } from "vitest";
import {
  growthFormLinearAppressorialClassifierExample,
  runGrowthFormLinearAppressorialClassifier,
} from "./tool.js";

describe("Growth Form Classifier", () => {
  it("matches the canonical example", () => {
    expect(
      runGrowthFormLinearAppressorialClassifier(
        growthFormLinearAppressorialClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: growthFormLinearAppressorialClassifierExample.output,
    });
  });
  it("passes through linear", () =>
    expect(
      runGrowthFormLinearAppressorialClassifier({ pattern: "linear" }),
    ).toEqual({ ok: true, output: { growthFormClass: "linear" } }));
  it("passes through aerial-fluffy", () =>
    expect(
      runGrowthFormLinearAppressorialClassifier({ pattern: "aerial-fluffy" }),
    ).toEqual({ ok: true, output: { growthFormClass: "aerial-fluffy" } }));
  it("passes through appressed-appressorial", () =>
    expect(
      runGrowthFormLinearAppressorialClassifier({
        pattern: "appressed-appressorial",
      }),
    ).toEqual({
      ok: true,
      output: { growthFormClass: "appressed-appressorial" },
    }));
  it("rejects unknown patterns", () =>
    expect(
      runGrowthFormLinearAppressorialClassifier({
        pattern: "rhizomorphic",
      } as unknown as { pattern: "linear" }).ok,
    ).toBe(false));
  it("requires the pattern field", () =>
    expect(
      runGrowthFormLinearAppressorialClassifier(
        {} as unknown as { pattern: "linear" },
      ).ok,
    ).toBe(false));
});
