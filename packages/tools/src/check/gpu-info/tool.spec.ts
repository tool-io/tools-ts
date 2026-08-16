import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  calculateGpuInfo,
  gpuInfoExample,
  gpuInfoTool,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateGpuInfo>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("GPU Info Checker", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = gpuInfoTool.execute(gpuInfoExample.input);
    expect(result).toEqual({ ok: true, output: gpuInfoExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(gpuInfoTool.id).toBe("check/gpu-info");
    expect(validateToolContract(gpuInfoTool)).toEqual([]);
  });

  it("classifies integrated and software renderers", () => {
    const apple = calculateGpuInfo({
      renderer: "Apple M2",
      vendor: "Apple Inc.",
    });
    expect(apple.ok).toBe(true);
    if (apple.ok) {
      expect(apple.output.vendor).toBe("apple");
      expect(apple.output.integration).toBe("integrated");
      expect(apple.output.modelToken).toBe("Apple M2");
    }
    const software = calculateGpuInfo({ renderer: "SwiftShader" });
    expect(software.ok).toBe(true);
    if (software.ok)
      expect(software.output.issues).toContain("software-renderer");
  });

  it("flags unknown vendors", () => {
    const result = calculateGpuInfo({
      renderer: "Mystery Graphics Blaster 9000",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.vendor).toBe("unknown");
      expect(result.output.issues).toEqual(["vendor-unknown"]);
      expect(result.output.modelToken).toBeNull();
    }
  });

  it("rejects malformed probes", () => {
    expect(calculateGpuInfo(null).ok).toBe(false);
    expect(issueCodes(calculateGpuInfo({}))).toEqual(["renderer_required"]);
    expect(issueCodes(calculateGpuInfo({ renderer: "   " }))).toEqual([
      "renderer_invalid",
    ]);
    expect(
      issueCodes(calculateGpuInfo({ extra: true, renderer: "ok" })),
    ).toEqual(["unknown_field"]);
    expect(
      issueCodes(calculateGpuInfo({ renderer: "x".repeat(513) })),
    ).toEqual(["renderer_invalid"]);
  });
});
