import { describe, expect, it } from "vitest";
import {
  jahnTellerDistortionCheckerExample,
  runJahnTellerDistortionChecker,
} from "./tool.js";

describe("Octahedral Jahn-Teller Distortion Checker", () => {
  it("publishes an executable uneven-occupancy example", () =>
    expect(
      runJahnTellerDistortionChecker(jahnTellerDistortionCheckerExample.input),
    ).toEqual({ ok: true, output: jahnTellerDistortionCheckerExample.output }));
  it.each([1, 3])("flags e_g^%i as strongly active", (count) =>
    expect(runJahnTellerDistortionChecker({ egElectronCount: count })).toEqual({
      ok: true,
      output: { strongDistortionExpected: true },
    }),
  );
  it.each([0, 2, 4])("does not flag e_g^%i as strongly active", (count) =>
    expect(runJahnTellerDistortionChecker({ egElectronCount: count })).toEqual({
      ok: true,
      output: { strongDistortionExpected: false },
    }),
  );
  it("rejects an impossible e_g occupancy", () =>
    expect(runJahnTellerDistortionChecker({ egElectronCount: 5 }).ok).toBe(
      false,
    ));
});
