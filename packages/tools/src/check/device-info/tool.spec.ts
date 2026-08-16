import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateDeviceInfo,
  deviceInfoExample,
  deviceInfoTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateDeviceInfo>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Device Info Checker", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = deviceInfoTool.execute(deviceInfoExample.input);
    expect(result).toEqual({ ok: true, output: deviceInfoExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(deviceInfoTool.id).toBe("check/device-info");
    expect(validateToolContract(deviceInfoTool)).toEqual([]);
  });

  it("normalizes architecture and OS aliases", () => {
    const result = calculateDeviceInfo({
      architecture: "AMD64",
      osName: " Mac OS ",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.architecture).toBe("x86_64");
      expect(result.output.osName).toBe("macos");
    }
    const win = calculateDeviceInfo({ osName: "WIN32" });
    expect(win.ok).toBe(true);
    if (win.ok) expect(win.output.osName).toBe("windows");
  });

  it("infers form factor from platform hints but respects explicit values", () => {
    const inferred = calculateDeviceInfo({ platform: "iPad13,4" });
    expect(inferred.ok).toBe(true);
    if (inferred.ok) expect(inferred.output.formFactor).toBe("tablet");
    const desktop = calculateDeviceInfo({ platform: "MacPro7,1" });
    expect(desktop.ok).toBe(true);
    if (desktop.ok) expect(desktop.output.formFactor).toBe("desktop");
    const explicit = calculateDeviceInfo({
      formFactor: "laptop",
      platform: "iPhone14,2",
    });
    expect(explicit.ok).toBe(true);
    if (explicit.ok) expect(explicit.output.formFactor).toBe("laptop");
  });

  it("classifies performance tiers", () => {
    const low = calculateDeviceInfo({ cpuCores: 2, memoryGb: 2 });
    expect(low.ok).toBe(true);
    if (low.ok) {
      expect(low.output.cpuCoreTier).toBe("low");
      expect(low.output.memoryTier).toBe("low");
    }
    const high = calculateDeviceInfo({ cpuCores: 16, memoryGb: 32 });
    expect(high.ok).toBe(true);
    if (high.ok) {
      expect(high.output.cpuCoreTier).toBe("high");
      expect(high.output.memoryTier).toBe("high");
    }
  });

  it("tracks identification confidence and missing fields", () => {
    const empty = calculateDeviceInfo({});
    expect(empty.ok).toBe(true);
    if (empty.ok) {
      expect(empty.output.confidence).toBe("none");
      expect(empty.output.missingFields).toEqual([
        "architecture",
        "cpuCores",
        "memoryGb",
        "osName",
      ]);
    }
    const partial = calculateDeviceInfo({ osName: "Android" });
    expect(partial.ok).toBe(true);
    if (partial.ok)
      expect(partial.output.confidence).toBe("minimal");
    const fuller = calculateDeviceInfo({ cpuCores: 4, osName: "android" });
    expect(fuller.ok).toBe(true);
    if (fuller.ok) expect(fuller.output.confidence).toBe("partial");
  });

  it("rejects malformed probes", () => {
    expect(calculateDeviceInfo(null).ok).toBe(false);
    expect(issueCodes(calculateDeviceInfo({ extra: true }))).toEqual([
      "unknown_field",
    ]);
    expect(
      issueCodes(calculateDeviceInfo({ architecture: "" })),
    ).toEqual(["architecture_invalid"]);
    expect(issueCodes(calculateDeviceInfo({ cpuCores: 0 }))).toEqual([
      "cpu_cores_invalid",
    ]);
    expect(issueCodes(calculateDeviceInfo({ memoryGb: -3 }))).toEqual([
      "memory_gb_invalid",
    ]);
    expect(issueCodes(calculateDeviceInfo({ formFactor: "server" }))).toEqual([
      "form_factor_invalid",
    ]);
    expect(issueCodes(calculateDeviceInfo({ osVersion: 5 }))).toEqual([
      "os_version_invalid",
    ]);
  });
});
