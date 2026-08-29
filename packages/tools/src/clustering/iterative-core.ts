import { simpleError } from "../core/simple.js";

const distance2 = (a: readonly number[], b: readonly number[]): number =>
  a.reduce((sum, value, i) => sum + (value - b[i]!) ** 2, 0);
const validate = (points: readonly number[][], clusters: number): number => {
  const dimension = points[0]?.length ?? 0;
  if (
    !dimension ||
    !points.length ||
    points.some((point) => point.length !== dimension)
  )
    simpleError("points", "Provide nonempty rectangular points.");
  if (clusters < 1 || clusters > points.length)
    simpleError("clusters", "Clusters must be between 1 and point count.");
  return dimension;
};
const initial = (points: number[][], clusters: number): number[][] => {
  const centers: number[][] = [[...points[0]!]];
  while (centers.length < clusters) {
    let best = -1,
      bestDistance = -1;
    for (let i = 0; i < points.length; i++) {
      const d = Math.min(
        ...centers.map((center) => distance2(points[i]!, center)),
      );
      if (d > bestDistance) {
        bestDistance = d;
        best = i;
      }
    }
    if (bestDistance <= 0)
      simpleError(
        "clusters",
        "Distinct clusters require at least that many distinct points.",
      );
    centers.push([...points[best]!]);
  }
  return centers;
};
const closest = (point: number[], centers: number[][]): number =>
  centers.reduce(
    (best, center, i) =>
      distance2(point, center) < distance2(point, centers[best]!) ? i : best,
    0,
  );
const finite = (centers: number[][]): number[][] => {
  if (centers.some((row) => row.some((value) => !Number.isFinite(value))))
    simpleError("points", "Clustering produced a non-finite centroid.");
  return centers;
};

export const kMeans = (
  points: number[][],
  clusters: number,
  maxIterations: number,
): { centroids: number[][]; labels: number[]; iterations: number } => {
  const dimension = validate(points, clusters);
  let centroids = initial(points, clusters),
    labels = points.map((point) => closest(point, centroids));
  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    const sums = Array.from({ length: clusters }, () =>
      Array<number>(dimension).fill(0),
    );
    const counts = Array<number>(clusters).fill(0);
    points.forEach((point, i) => {
      const label = labels[i]!;
      counts[label]!++;
      point.forEach((v, j) => {
        sums[label]![j]! += v;
      });
    });
    const next = sums.map((sum, i) =>
      counts[i]! ? sum.map((v) => v / counts[i]!) : centroids[i]!,
    );
    const nextLabels = points.map((point) => closest(point, next));
    if (nextLabels.every((label, i) => label === labels[i]))
      return {
        centroids: finite(next),
        labels: nextLabels,
        iterations: iteration,
      };
    centroids = next;
    labels = nextLabels;
  }
  return { centroids: finite(centroids), labels, iterations: maxIterations };
};

const membership = (
  point: number[],
  centers: number[][],
  fuzzifier: number,
): number[] => {
  const distances = centers.map((center) => distance2(point, center));
  const zeros = distances
    .map((value, i) => (value === 0 ? i : -1))
    .filter((i) => i >= 0);
  if (zeros.length)
    return centers.map((_, i) => (zeros.includes(i) ? 1 / zeros.length : 0));
  const exponent = 1 / (fuzzifier - 1);
  return distances.map(
    (d) =>
      1 / distances.reduce((sum, other) => sum + (d / other) ** exponent, 0),
  );
};

export const fuzzyCMeans = (
  points: number[][],
  clusters: number,
  fuzzifier: number,
  maxIterations: number,
) => {
  const dimension = validate(points, clusters);
  if (!(fuzzifier > 1))
    simpleError("fuzzifier", "Fuzzifier must be greater than one.");
  let centroids = initial(points, clusters),
    memberships: number[][] = [];
  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    memberships = points.map((point) =>
      membership(point, centroids, fuzzifier),
    );
    const next = Array.from({ length: clusters }, (_, j) => {
      const weights = memberships.map((row) => row[j]! ** fuzzifier);
      const total = weights.reduce((a, b) => a + b, 0);
      return total === 0
        ? centroids[j]!
        : Array.from(
            { length: dimension },
            (_, d) =>
              points.reduce(
                (sum, point, i) => sum + weights[i]! * point[d]!,
                0,
              ) / total,
          );
    });
    if (next.every((center, j) => distance2(center, centroids[j]!) < 1e-12))
      return { centroids: finite(next), memberships, iterations: iteration };
    centroids = next;
  }
  return {
    centroids: finite(centroids),
    memberships,
    iterations: maxIterations,
  };
};

export const possibilisticCMeans = (
  points: number[][],
  clusters: number,
  fuzzifier: number,
  scale: number,
  maxIterations: number,
) => {
  const dimension = validate(points, clusters);
  if (!(fuzzifier > 1) || !(scale > 0))
    simpleError(
      "scale",
      "Fuzzifier must exceed one and scale must be positive.",
    );
  let centroids = initial(points, clusters),
    typicalities: number[][] = [];
  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    typicalities = points.map((point) =>
      centroids.map(
        (center) =>
          1 / (1 + (distance2(point, center) / scale) ** (1 / (fuzzifier - 1))),
      ),
    );
    const next = Array.from({ length: clusters }, (_, j) => {
      const weights = typicalities.map((row) => row[j]! ** fuzzifier);
      const total = weights.reduce((a, b) => a + b, 0);
      return total === 0
        ? centroids[j]!
        : Array.from(
            { length: dimension },
            (_, d) =>
              points.reduce(
                (sum, point, i) => sum + weights[i]! * point[d]!,
                0,
              ) / total,
          );
    });
    if (next.every((center, j) => distance2(center, centroids[j]!) < 1e-12))
      return { centroids: finite(next), typicalities, iterations: iteration };
    centroids = next;
  }
  return {
    centroids: finite(centroids),
    typicalities,
    iterations: maxIterations,
  };
};

export const meanShift = (
  points: number[][],
  bandwidth: number,
  maxIterations: number,
) => {
  const dimension = validate(points, 1);
  if (!(bandwidth > 0)) simpleError("bandwidth", "Bandwidth must be positive.");
  const radius2 = bandwidth ** 2;
  const shifted = points.map((start) => {
    let center = [...start];
    for (let i = 0; i < maxIterations; i++) {
      const neighbors = points.filter(
        (point) => distance2(point, center) <= radius2,
      );
      const next = Array.from(
        { length: dimension },
        (_, d) =>
          neighbors.reduce((sum, point) => sum + point[d]!, 0) /
          neighbors.length,
      );
      if (distance2(center, next) < 1e-12) return next;
      center = next;
    }
    return center;
  });
  const modes: number[][] = [],
    labels: number[] = [];
  for (const center of shifted) {
    const existing = modes.findIndex(
      (mode) => distance2(mode, center) <= radius2 / 4,
    );
    if (existing >= 0) labels.push(existing);
    else {
      labels.push(modes.length);
      modes.push(center);
    }
  }
  return { modes: finite(modes), labels };
};
