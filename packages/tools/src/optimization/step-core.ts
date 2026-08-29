import { simpleError } from "../core/simple.js";

export const requireVectors = (vectors: readonly number[][]): number => {
  const length = vectors[0]?.length ?? 0;
  if (
    !length ||
    length > 1000 ||
    vectors.some((vector) => vector.length !== length)
  )
    simpleError(
      "position",
      "Vectors must be nonempty and have equal lengths of at most 1000.",
    );
  return length;
};
export const dot = (a: readonly number[], b: readonly number[]): number =>
  a.reduce((sum, value, i) => sum + value * b[i]!, 0);
export const addScaled = (
  a: readonly number[],
  b: readonly number[],
  scale: number,
): number[] => a.map((value, i) => value + scale * b[i]!);
export const finiteVector = (values: number[]): number[] => {
  if (values.some((value) => !Number.isFinite(value)))
    simpleError("position", "Step is outside the finite number range.");
  return values;
};

export const gradientDescent = (x: number[], g: number[], rate: number) => {
  requireVectors([x, g]);
  return { nextPosition: finiteVector(addScaled(x, g, -rate)) };
};

export const steepestDescent = (x: number[], g: number[], length: number) => {
  requireVectors([x, g]);
  const norm = Math.sqrt(dot(g, g));
  if (!(norm > 0)) simpleError("gradient", "Gradient must be nonzero.");
  return { nextPosition: finiteVector(addScaled(x, g, -length / norm)) };
};

export const conjugateGradient = (
  x: number[],
  g: number[],
  previousG: number[],
  previousDirection: number[],
  rate: number,
) => {
  requireVectors([x, g, previousG, previousDirection]);
  const denominator = dot(previousG, previousG);
  const beta = denominator === 0 ? 0 : dot(g, g) / denominator;
  const direction = finiteVector(
    g.map((value, i) => -value + beta * previousDirection[i]!),
  );
  return {
    beta,
    direction,
    nextPosition: finiteVector(addScaled(x, direction, rate)),
  };
};

export const interiorPoint = (
  x: number[],
  gradient: number[],
  barrierWeight: number,
  rate: number,
) => {
  requireVectors([x, gradient]);
  if (x.some((value) => value <= 0))
    simpleError("position", "Log-barrier positions must be strictly positive.");
  const barrierGradient = gradient.map(
    (value, i) => value - barrierWeight / x[i]!,
  );
  const nextPosition = finiteVector(addScaled(x, barrierGradient, -rate));
  if (nextPosition.some((value) => value <= 0))
    simpleError(
      "learningRate",
      "Step would leave the positive feasible region; reduce learning rate.",
    );
  return { nextPosition };
};

export const nadam = (
  x: number[],
  gradient: number[],
  m: number[],
  v: number[],
  beta1: number,
  beta2: number,
  rate: number,
  epsilon: number,
  iteration: number,
) => {
  requireVectors([x, gradient, m, v]);
  if (v.some((value) => value < 0))
    simpleError("secondMoment", "Second moments must be nonnegative.");
  if (beta1 < 0 || beta1 >= 1 || beta2 < 0 || beta2 >= 1)
    simpleError("beta1", "Beta coefficients must be in [0,1).");
  const firstMoment = m.map(
    (value, i) => beta1 * value + (1 - beta1) * gradient[i]!,
  );
  const secondMoment = v.map(
    (value, i) => beta2 * value + (1 - beta2) * gradient[i]! ** 2,
  );
  const correction1 = 1 - beta1 ** iteration;
  const correction2 = 1 - beta2 ** iteration;
  const nextPosition = x.map((value, i) => {
    const lookahead =
      (beta1 * firstMoment[i]!) / correction1 +
      ((1 - beta1) * gradient[i]!) / correction1;
    return (
      value -
      (rate * lookahead) / (Math.sqrt(secondMoment[i]! / correction2) + epsilon)
    );
  });
  return {
    firstMoment: finiteVector(firstMoment),
    secondMoment: finiteVector(secondMoment),
    nextPosition: finiteVector(nextPosition),
  };
};

export const trustRegion = (
  x: number[],
  gradient: number[],
  diagonal: number[],
  radius: number,
) => {
  requireVectors([x, gradient, diagonal]);
  if (diagonal.some((value) => value < 0))
    simpleError(
      "hessianDiagonal",
      "This diagonal trust-region model requires nonnegative curvature.",
    );
  const stepAt = (lambda: number) =>
    gradient.map((g, i) => -g / (diagonal[i]! + lambda));
  const normAt = (lambda: number) => Math.hypot(...stepAt(lambda));
  let lower = 0,
    upper = 1;
  if (diagonal.every((value) => value > 0) && normAt(0) <= radius) {
    const step = finiteVector(stepAt(0));
    return { step, nextPosition: finiteVector(addScaled(x, step, 1)) };
  }
  while (normAt(upper) > radius && upper < 1e300) upper *= 2;
  for (let i = 0; i < 100; i++) {
    const mid = (lower + upper) / 2;
    if (normAt(mid) > radius) lower = mid;
    else upper = mid;
  }
  const step = finiteVector(stepAt(upper));
  return { step, nextPosition: finiteVector(addScaled(x, step, 1)) };
};

export const lbfgs = (
  x: number[],
  gradient: number[],
  displacements: number[][],
  gradientChanges: number[][],
  rate: number,
) => {
  const n = requireVectors([x, gradient]);
  if (
    displacements.length !== gradientChanges.length ||
    displacements.length > 20
  )
    simpleError(
      "displacements",
      "Supply matching histories of at most 20 vector pairs.",
    );
  if (
    [...displacements, ...gradientChanges].some((vector) => vector.length !== n)
  )
    simpleError(
      "displacements",
      "History vector dimension differs from position.",
    );
  const rho = displacements.map((s, i) => {
    const curvature = dot(s, gradientChanges[i]!);
    if (!(curvature > 0))
      simpleError("gradientChanges", "Each s·y curvature must be positive.");
    return 1 / curvature;
  });
  let q = [...gradient];
  const alpha = Array<number>(displacements.length).fill(0);
  for (let i = displacements.length - 1; i >= 0; i--) {
    alpha[i] = rho[i]! * dot(displacements[i]!, q);
    q = addScaled(q, gradientChanges[i]!, -alpha[i]!);
  }
  const last = displacements.length - 1;
  const scale =
    last < 0
      ? 1
      : dot(displacements[last]!, gradientChanges[last]!) /
        dot(gradientChanges[last]!, gradientChanges[last]!);
  let direction = q.map((value) => value * scale);
  for (let i = 0; i < displacements.length; i++) {
    const beta = rho[i]! * dot(gradientChanges[i]!, direction);
    direction = addScaled(direction, displacements[i]!, alpha[i]! - beta);
  }
  return { nextPosition: finiteVector(addScaled(x, direction, -rate)) };
};
