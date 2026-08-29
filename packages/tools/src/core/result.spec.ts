import { describe, expect, it } from "vitest";
import {
  toolCapabilityUnavailable,
  toolDatasetUnavailable,
  toolExecutionFailed,
} from "./result.js";

describe("stable tool errors", () => {
  it("identifies an unavailable versioned capability", () => {
    expect(toolCapabilityUnavailable("network/public-ip", 1)).toEqual({
      error: {
        capability: { id: "network/public-ip", schemaVersion: 1 },
        code: "capability_unavailable",
        issues: [
          {
            code: "capability_unavailable",
            field: "",
            message:
              'Required capability "network/public-ip" Version 1 is unavailable.',
          },
        ],
      },
      ok: false,
    });
  });

  it("identifies an unavailable versioned dataset", () => {
    expect(toolDatasetUnavailable("weather/observations", 2)).toMatchObject({
      error: {
        code: "dataset_unavailable",
        dataset: { id: "weather/observations", schemaVersion: 2 },
      },
      ok: false,
    });
  });

  it("keeps unexpected execution failures distinct from invalid input", () => {
    expect(toolExecutionFailed("Adapter failed.")).toEqual({
      error: {
        code: "execution_failed",
        issues: [
          {
            code: "execution_failed",
            field: "",
            message: "Adapter failed.",
          },
        ],
      },
      ok: false,
    });
  });
});
