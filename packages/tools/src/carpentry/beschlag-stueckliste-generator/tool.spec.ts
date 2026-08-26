import { describe, expect, it } from "vitest";
import { hardwareBomExample, runHardwareBom } from "./tool.js";

describe("Hardware Bill of Materials Generator", () => {
  it("publishes an executable example with the default hinges per door", () =>
    expect(runHardwareBom(hardwareBomExample.input)).toEqual({
      ok: true,
      output: hardwareBomExample.output,
    }));

  it("applies two hinges per door by default", () => {
    const result = runHardwareBom({ doorCount: 5, drawerCount: 0 });
    expect(result).toEqual({
      ok: true,
      output: { handleCount: 5, hingeCount: 10, slidePairCount: 0 },
    });
  });

  it.each([
    [
      { doorCount: 4, drawerCount: 2, hingesPerDoor: 3 },
      { handleCount: 6, hingeCount: 12, slidePairCount: 2 },
    ],
    [
      { doorCount: 1, drawerCount: 1, hingesPerDoor: 1 },
      { handleCount: 2, hingeCount: 1, slidePairCount: 1 },
    ],
    [
      { doorCount: 0, drawerCount: 4 },
      { handleCount: 4, hingeCount: 0, slidePairCount: 4 },
    ],
    [
      { doorCount: 3, drawerCount: 0 },
      { handleCount: 3, hingeCount: 6, slidePairCount: 0 },
    ],
    [
      { doorCount: 0, drawerCount: 0 },
      { handleCount: 0, hingeCount: 0, slidePairCount: 0 },
    ],
  ])(
    "sums hardware for $doorCount doors and $drawerCount drawers",
    (input, output) =>
      expect(runHardwareBom(input)).toEqual({ ok: true, output }),
  );

  it("counts one handle per front and one slide pair per drawer", () => {
    const result = runHardwareBom({ doorCount: 7, drawerCount: 9 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.handleCount).toBe(16);
      expect(result.output.slidePairCount).toBe(9);
    }
  });

  it("rejects a negative door count", () => {
    const result = runHardwareBom({ doorCount: -1, drawerCount: 0 });
    expect(result.ok).toBe(false);
  });

  it("rejects a negative drawer count", () => {
    const result = runHardwareBom({ doorCount: 0, drawerCount: -2 });
    expect(result.ok).toBe(false);
  });

  it("rejects fewer than one hinge per door", () => {
    const result = runHardwareBom({
      doorCount: 1,
      drawerCount: 1,
      hingesPerDoor: 0,
    });
    expect(result.ok).toBe(false);
  });

  it("rejects non-integer counts", () => {
    expect(runHardwareBom({ doorCount: 1.5, drawerCount: 0 }).ok).toBe(false);
    expect(runHardwareBom({ doorCount: 0, drawerCount: Number.NaN }).ok).toBe(
      false,
    );
  });

  it("rejects missing and unknown inputs", () => {
    expect(runHardwareBom({ drawerCount: 1 }).ok).toBe(false);
    expect(runHardwareBom({ doorCount: 1, drawerCount: 1, extra: 1 }).ok).toBe(
      false,
    );
  });
});
