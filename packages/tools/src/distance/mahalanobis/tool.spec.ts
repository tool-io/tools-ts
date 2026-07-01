import { describe, expect, it } from "vitest";
import { calculateMahalanobisDistance } from "./tool.js";
describe("Mahalanobis distance", () => { it("matches Euclidean distance for identity covariance", () => expect(calculateMahalanobisDistance({ vector: [3, 4], mean: [0, 0], covariance: [[1, 0], [0, 1]] })).toEqual({ ok: true, output: { distance: 5, squaredDistance: 25 } })); it("rejects singular covariance", () => expect(calculateMahalanobisDistance({ vector: [1, 1], mean: [0, 0], covariance: [[1, 1], [1, 1]] }).ok).toBe(false)); });
