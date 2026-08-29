import { describe, expect, it } from "vitest";
import { validateToolContract } from "../core/contract.js";
import { WATER_THERMAL_DIFFUSIVITY_CM2_S } from "./laser-thulium-holmium-two-micron-water-absorption-cutting-depth-table/index.js";

const tools = {
  "laser/laser-diode-threshold-current-temperature-characteristic-t0-lookup":
    await import("./laser-diode-threshold-current-temperature-characteristic-t0-lookup/index.js"),
  "laser/laser-diode-li-curve-kink-detection-threshold-extraction-method":
    await import("./laser-diode-li-curve-kink-detection-threshold-extraction-method/index.js"),
  "laser/laser-vcsel-versus-edge-emitter-divergence-comparison-table-lookup":
    await import("./laser-vcsel-versus-edge-emitter-divergence-comparison-table-lookup/index.js"),
  "laser/laser-dfb-grating-period-bragg-wavelength-calculator":
    await import("./laser-dfb-grating-period-bragg-wavelength-calculator/index.js"),
  "laser/laser-external-cavity-diode-laser-littrow-littman-config-selector":
    await import("./laser-external-cavity-diode-laser-littrow-littman-config-selector/index.js"),
  "laser/laser-diode-driver-pulse-width-current-limit-series-resistor-design":
    await import("./laser-diode-driver-pulse-width-current-limit-series-resistor-design/index.js"),
  "laser/laser-facet-coating-ar-hr-mirror-power-ratio-lookup":
    await import("./laser-facet-coating-ar-hr-mirror-power-ratio-lookup/index.js"),
  "laser/laser-quantum-well-transition-wavelength-material-algaas-ingaas-gan-table":
    await import("./laser-quantum-well-transition-wavelength-material-algaas-ingaas-gan-table/index.js"),
  "laser/laser-bar-array-smile-effect-beam-pointing-microradian-budget-checker":
    await import("./laser-bar-array-smile-effect-beam-pointing-microradian-budget-checker/index.js"),
  "laser/laser-diode-accelerated-aging-arrhenius-mtbf-estimate-calculator":
    await import("./laser-diode-accelerated-aging-arrhenius-mtbf-estimate-calculator/index.js"),
  "laser/laser-nd-yag-four-level-rate-equation-threshold-inversion-computation":
    await import("./laser-nd-yag-four-level-rate-equation-threshold-inversion-computation/index.js"),
  "laser/laser-ti-sapphire-tuning-range-kerr-lens-mode-locking-prerequisite-checker":
    await import("./laser-ti-sapphire-tuning-range-kerr-lens-mode-locking-prerequisite-checker/index.js"),
  "laser/laser-nd-yvo4-vs-nd-yag-absorption-cross-section-compare-lookup":
    await import("./laser-nd-yvo4-vs-nd-yag-absorption-cross-section-compare-lookup/index.js"),
  "laser/laser-yb-yag-thin-disk-multipass-pump-absorption-efficiency-calculator":
    await import("./laser-yb-yag-thin-disk-multipass-pump-absorption-efficiency-calculator/index.js"),
  "laser/laser-er-fiber-1550-eye-safe-retina-transmission-safety-class-note":
    await import("./laser-er-fiber-1550-eye-safe-retina-transmission-safety-class-note/index.js"),
  "laser/laser-thulium-holmium-two-micron-water-absorption-cutting-depth-table":
    await import("./laser-thulium-holmium-two-micron-water-absorption-cutting-depth-table/index.js"),
  "laser/laser-flashlamp-versus-diode-pumping-wall-plug-efficiency-compare":
    await import("./laser-flashlamp-versus-diode-pumping-wall-plug-efficiency-compare/index.js"),
  "laser/laser-quantum-cascade-laser-mid-ir-fingerprint-selection-table-lookup":
    await import("./laser-quantum-cascade-laser-mid-ir-fingerprint-selection-table-lookup/index.js"),
  "laser/laser-edfa-gain-bandwidth-c-band-l-band-split-lookup":
    await import("./laser-edfa-gain-bandwidth-c-band-l-band-split-lookup/index.js"),
  "laser/laser-ytterbium-fiber-single-mode-kilowatt-power-scaling-record-lookup":
    await import("./laser-ytterbium-fiber-single-mode-kilowatt-power-scaling-record-lookup/index.js"),
} as const;

describe("Laser family", () => {
  it("enumerates every laser tool directory", () => {
    expect(Object.keys(tools).length).toBe(20);
  });

  for (const [id, module] of Object.entries(tools)) {
    it(`${id} publishes a valid contract and executes its example`, () => {
      const tool = module.default;
      expect(tool).toBeDefined();
      expect(tool.id).toBe(id);
      expect(validateToolContract(tool)).toEqual([]);
      const example = (
        module as unknown as {
          example: { input: Record<string, unknown>; output?: unknown };
        }
      ).example;
      expect(example).toBeDefined();
      const result = tool.execute(example.input);
      if ("output" in example && example.output !== undefined)
        expect(result).toEqual({ ok: true, output: example.output });
      else expect(result.ok).toBe(true);
    });
  }

  it("T0 characteristic scales threshold exponentially", () => {
    const tool =
      tools[
        "laser/laser-diode-threshold-current-temperature-characteristic-t0-lookup"
      ].default;
    const result = tool.execute({ iRefMa: 20, tRefC: 25, tOpC: 65, t0K: 70 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as { iThMa: number };
      expect(output.iThMa).toBeCloseTo(20 * Math.exp(40 / 70), 10);
    }
  });

  it("extracts threshold and slope efficiency from a clean L-I curve", () => {
    const tool =
      tools[
        "laser/laser-diode-li-curve-kink-detection-threshold-extraction-method"
      ].default;
    const result = tool.execute({
      currentsMa: [5, 10, 15, 20, 25, 30, 35, 40],
      powersMw: [0, 0, 0, 0, 5, 10, 15, 20],
      tolerancePercent: 30,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as {
        kinkDetected: boolean;
        slopeEfficiencyMwPerMa: number;
        thresholdCurrentMa: number;
      };
      expect(output.thresholdCurrentMa).toBeCloseTo(20, 6);
      expect(output.slopeEfficiencyMwPerMa).toBeCloseTo(1.0, 6);
      expect(output.kinkDetected).toBe(false);
    }
  });

  it("computes DFB grating period from Bragg condition", () => {
    const tool =
      tools["laser/laser-dfb-grating-period-bragg-wavelength-calculator"]
        .default;
    const result = tool.execute({
      neff: 3.3,
      braggWavelengthNm: 1550,
      order: 1,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as { gratingPeriodNm: number };
      expect(output.gratingPeriodNm).toBeCloseTo(234.848484848, 6);
    }
  });

  it("flags insufficient headroom in series-resistor driver", () => {
    const tool =
      tools[
        "laser/laser-diode-driver-pulse-width-current-limit-series-resistor-design"
      ].default;
    const result = tool.execute({
      supplyVoltageV: 2,
      forwardVoltageV: 2,
      targetCurrentMa: 50,
    });
    expect(result.ok).toBe(false);
  });

  it("splits facet power between AR and HR coated facets", () => {
    const tool =
      tools["laser/laser-facet-coating-ar-hr-mirror-power-ratio-lookup"]
        .default;
    const result = tool.execute({
      mode: "coatings",
      rearReflectivityPercent: 98,
      frontReflectivityPercent: 5,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as {
        frontOutputFractionPercent: number;
        rearOutputFractionPercent: number;
      };
      expect(
        output.frontOutputFractionPercent + output.rearOutputFractionPercent,
      ).toBeCloseTo(100, 6);
    }
  });

  it("rejects AlGaAs with x > 0.45 (indirect gap)", () => {
    const tool =
      tools[
        "laser/laser-quantum-well-transition-wavelength-material-algaas-ingaas-gan-table"
      ].default;
    const result = tool.execute({ system: "algaas", fraction: 0.6 });
    expect(result.ok).toBe(false);
  });

  it("checks smile pointing against budget", () => {
    const tool =
      tools[
        "laser/laser-bar-array-smile-effect-beam-pointing-microradian-budget-checker"
      ].default;
    const result = tool.execute({
      collimatorFocalLengthMm: 15,
      smileUm: 2,
      allowedPointingUrad: 100,
      workingDistanceMm: 1000,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as {
        withinBudget: boolean;
        pointingUrad: number;
      };
      expect(output.withinBudget).toBe(false);
      expect(output.pointingUrad).toBeCloseTo(133.33, 1);
    }
  });

  it("projects Arrhenius lifetime from stress to use temperature", () => {
    const tool =
      tools[
        "laser/laser-diode-accelerated-aging-arrhenius-mtbf-estimate-calculator"
      ].default;
    const result = tool.execute({
      mtbfHoursStress: 100000,
      eaEv: 0.45,
      tUseC: 45,
      tStressC: 85,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as { accelerationFactor: number };
      expect(output.accelerationFactor).toBeGreaterThan(5);
      expect(output.accelerationFactor).toBeLessThan(8);
    }
  });

  it("computes Nd:YAG threshold inversion density", () => {
    const tool =
      tools[
        "laser/laser-nd-yag-four-level-rate-equation-threshold-inversion-computation"
      ].default;
    const result = tool.execute({ rodLengthMm: 100 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as { thresholdInversionPerCm3: number };
      expect(output.thresholdInversionPerCm3).toBeCloseTo(3.667e16, -13);
    }
  });

  it("classifies 1550 nm as the eye-safe band", () => {
    const tool =
      tools[
        "laser/laser-er-fiber-1550-eye-safe-retina-transmission-safety-class-note"
      ].default;
    const result = tool.execute({ wavelengthNm: 1550 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as {
        reachesRetina: boolean;
        eyeSafeLabelCommonlyUsed: boolean;
      };
      expect(output.reachesRetina).toBe(false);
      expect(output.eyeSafeLabelCommonlyUsed).toBe(true);
    }
  });

  it("looks up water absorption at the Ho:YAG wavelength", () => {
    const tool =
      tools[
        "laser/laser-thulium-holmium-two-micron-water-absorption-cutting-depth-table"
      ].default;
    const result = tool.execute({ wavelengthNm: 2090 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as {
        alphaWaterPerCm: number;
        penetrationDepthMicrometers: number;
      };
      expect(output.alphaWaterPerCm).toBeCloseTo(30, 6);
      expect(output.penetrationDepthMicrometers).toBeCloseTo(333.33, 1);
    }
  });

  it("shows diode pumping beats flashlamp wall-plug efficiency", () => {
    const tool =
      tools[
        "laser/laser-flashlamp-versus-diode-pumping-wall-plug-efficiency-compare"
      ].default;
    const result = tool.execute({});
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as {
        flashlampWallPlugPercent: number;
        diodeWallPlugPercent: number;
      };
      expect(output.diodeWallPlugPercent).toBeGreaterThan(
        output.flashlampWallPlugPercent * 4,
      );
    }
  });

  it("selects CO₂ fingerprint window for QCL", () => {
    const tool =
      tools[
        "laser/laser-quantum-cascade-laser-mid-ir-fingerprint-selection-table-lookup"
      ].default;
    const result = tool.execute({ gasId: "co2" });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as { centerUm: number };
      expect(output.centerUm).toBeCloseTo(4.3, 1);
    }
  });

  it("assigns 1550 nm to the C-band", () => {
    const tool =
      tools["laser/laser-edfa-gain-bandwidth-c-band-l-band-split-lookup"]
        .default;
    const result = tool.execute({ wavelengthNm: 1550 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as {
        bandName: string;
        positionWithinBandPercent: number;
      };
      expect(output.bandName).toBe("C-band");
      expect(output.positionWithinBandPercent).toBeCloseTo(57.14, 1);
    }
  });

  it("reports Yb-fiber power scaling at 2013", () => {
    const tool =
      tools[
        "laser/laser-ytterbium-fiber-single-mode-kilowatt-power-scaling-record-lookup"
      ].default;
    const result = tool.execute({ year: 2013 });
    expect(result.ok).toBe(true);
    if (result.ok) {
      const output = result.output as {
        singleModePowerKw: number;
        milestoneYear: number;
      };
      expect(output.singleModePowerKw).toBe(10);
      expect(output.milestoneYear).toBe(2013);
    }
  });

  it("uses the correct water thermal diffusivity constant", () => {
    expect(WATER_THERMAL_DIFFUSIVITY_CM2_S).toBeCloseTo(1.43e-3, 6);
  });
});
