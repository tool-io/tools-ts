import { simpleError } from "../core/simple.js";
import {
  createSeededRandom,
  type RandomSource,
} from "../random/seeded-number/tool.js";
import {
  gammaSample,
  normalSample,
  unitRandom,
} from "./distribution-sampler.js";

const source = (seed: string): RandomSource => {
  if (!seed.trim()) simpleError("seed", "Seed must be nonempty.");
  return createSeededRandom(seed);
};
const requireCount = (count: number): void => {
  if (!Number.isSafeInteger(count) || count < 1 || count > 1000)
    simpleError("count", "Use 1–1000 samples.");
};
const probabilities = (values: number[]): number[] => {
  if (!values.length || values.some((v) => v < 0))
    simpleError("probabilities", "Provide nonnegative probabilities.");
  const sum = values.reduce((a, b) => a + b, 0);
  if (!(sum > 0) || !Number.isFinite(sum))
    simpleError("probabilities", "Probabilities need a finite positive total.");
  return values.map((v) => v / sum);
};
const drawIndex = (values: number[], random: RandomSource): number => {
  let threshold = unitRandom(random);
  for (let i = 0; i < values.length; i++) {
    threshold -= values[i]!;
    if (threshold < 0) return i;
  }
  return values.length - 1;
};

export const sampleDirichlet = (
  alpha: number[],
  count: number,
  seed: string,
) => {
  requireCount(count);
  if (!alpha.length || alpha.length > 100 || alpha.some((v) => !(v > 0)))
    simpleError("alpha", "Use 1–100 positive concentration values.");
  const random = source(seed);
  const samples = Array.from({ length: count }, () => {
    const values = alpha.map((shape) => gammaSample(shape, random));
    const sum = values.reduce((a, b) => a + b, 0);
    if (!(sum > 0) || !Number.isFinite(sum))
      simpleError("alpha", "Gamma draw could not be normalized.");
    return values.map((v) => v / sum);
  });
  return { samples };
};

export const sampleDirichletProcess = (
  concentration: number,
  components: number,
  count: number,
  seed: string,
) => {
  requireCount(count);
  if (!(concentration > 0) || components < 2 || components > 100)
    simpleError(
      "components",
      "Use positive concentration and 2–100 components.",
    );
  const random = source(seed);
  const weights = Array.from({ length: count }, () => {
    let remainder = 1;
    const result: number[] = [];
    for (let i = 0; i < components - 1; i++) {
      const beta = 1 - unitRandom(random) ** (1 / concentration);
      result.push(remainder * beta);
      remainder *= 1 - beta;
    }
    result.push(remainder);
    return result;
  });
  return { weights };
};

export const sampleMultinomial = (
  probabilityValues: number[],
  trials: number,
  count: number,
  seed: string,
) => {
  requireCount(count);
  if (
    !Number.isSafeInteger(trials) ||
    trials < 0 ||
    trials > 100000 ||
    trials * count > 1000000
  )
    simpleError(
      "trials",
      "Trials must be 0–100,000 with at most one million total draws.",
    );
  const p = probabilities(probabilityValues),
    random = source(seed);
  const samples = Array.from({ length: count }, () => {
    const row = Array<number>(p.length).fill(0);
    for (let i = 0; i < trials; i++) row[drawIndex(p, random)]!++;
    return row;
  });
  return { samples };
};

export const sampleNegativeBinomial = (
  successes: number,
  successProbability: number,
  count: number,
  seed: string,
) => {
  requireCount(count);
  if (
    !Number.isSafeInteger(successes) ||
    successes < 1 ||
    successes > 10000 ||
    successes * count > 1000000 ||
    !(successProbability > 0 && successProbability <= 1)
  )
    simpleError(
      "successProbability",
      "Use a probability in (0,1] and at most one million success trials.",
    );
  const random = source(seed),
    samples: number[] = [];
  for (let i = 0; i < count; i++) {
    let failures = 0;
    for (let j = 0; j < successes; j++)
      failures += Math.floor(
        Math.log1p(-unitRandom(random)) / Math.log1p(-successProbability),
      );
    if (!Number.isSafeInteger(failures))
      simpleError(
        "successProbability",
        "Failure count exceeds the safe integer range.",
      );
    samples.push(failures);
  }
  return { samples };
};

export const sampleVonMises = (
  meanDirection: number,
  concentration: number,
  count: number,
  seed: string,
) => {
  requireCount(count);
  if (concentration < 0)
    simpleError("concentration", "Concentration must be nonnegative.");
  const random = source(seed),
    samples: number[] = [];
  for (let i = 0; i < count; i++) {
    if (concentration < 1e-8) {
      samples.push(
        (meanDirection + 2 * Math.PI * unitRandom(random)) % (2 * Math.PI),
      );
      continue;
    }
    const a = 1 + Math.sqrt(1 + 4 * concentration * concentration);
    const b = (a - Math.sqrt(2 * a)) / (2 * concentration);
    const r = (1 + b * b) / (2 * b);
    let accepted = false;
    for (let attempt = 0; attempt < 100000; attempt++) {
      const z = Math.cos(Math.PI * unitRandom(random));
      const f = (1 + r * z) / (r + z);
      const c = concentration * (r - f);
      const u = unitRandom(random);
      if (u < c * (2 - c) || Math.log(u) <= c - 1 + Math.log(c)) {
        const angle =
          meanDirection +
          (unitRandom(random) < 0.5 ? -1 : 1) *
            Math.acos(Math.max(-1, Math.min(1, f)));
        samples.push(
          ((((angle + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) %
            (2 * Math.PI)) -
            Math.PI,
        );
        accepted = true;
        break;
      }
    }
    if (!accepted)
      simpleError(
        "concentration",
        "Von Mises rejection sampler did not converge.",
      );
  }
  return { samples };
};

export const sampleFiniteMarkovChain = (
  transition: number[][],
  initialState: number,
  count: number,
  seed: string,
) => {
  requireCount(count);
  const n = transition.length;
  if (
    !n ||
    n > 100 ||
    transition.some(
      (row) =>
        row.length !== n ||
        row.some((v) => v < 0) ||
        Math.abs(row.reduce((a, b) => a + b, 0) - 1) > 1e-9,
    )
  )
    simpleError(
      "transition",
      "Supply a square transition matrix with nonnegative rows summing to one.",
    );
  if (
    !Number.isSafeInteger(initialState) ||
    initialState < 0 ||
    initialState >= n
  )
    simpleError("initialState", "Initial state is out of range.");
  const random = source(seed),
    samples: number[] = [];
  let state = initialState;
  for (let i = 0; i < count; i++) {
    state = drawIndex(transition[state]!, random);
    samples.push(state);
  }
  return { samples };
};

export const sampleMetropolisHastings = (
  start: number,
  proposalScale: number,
  count: number,
  seed: string,
) => {
  requireCount(count);
  if (!(proposalScale > 0))
    simpleError("proposalScale", "Proposal scale must be positive.");
  const random = source(seed),
    samples: number[] = [];
  let current = start,
    accepted = 0;
  for (let i = 0; i < count; i++) {
    const proposed = current + proposalScale * normalSample(random);
    const logAcceptance = (current * current - proposed * proposed) / 2;
    if (Math.log(unitRandom(random)) < Math.min(0, logAcceptance)) {
      current = proposed;
      accepted++;
    }
    samples.push(current);
  }
  return { samples, acceptanceRate: accepted / count };
};

export const sampleGibbsBivariateNormal = (
  correlation: number,
  startX: number,
  startY: number,
  count: number,
  seed: string,
) => {
  requireCount(count);
  if (!(correlation > -1 && correlation < 1))
    simpleError(
      "correlation",
      "Correlation must be strictly between -1 and 1.",
    );
  const random = source(seed),
    samples: number[][] = [];
  const scale = Math.sqrt(1 - correlation * correlation);
  let x = startX,
    y = startY;
  for (let i = 0; i < count; i++) {
    x = correlation * y + scale * normalSample(random);
    y = correlation * x + scale * normalSample(random);
    samples.push([x, y]);
  }
  return { samples };
};

export const sampleHamiltonianNormal = (
  start: number,
  stepSize: number,
  leapfrogSteps: number,
  count: number,
  seed: string,
) => {
  requireCount(count);
  if (
    !(stepSize > 0) ||
    leapfrogSteps < 1 ||
    leapfrogSteps > 1000 ||
    leapfrogSteps * count > 1000000
  )
    simpleError(
      "leapfrogSteps",
      "Use a positive step and at most one million leapfrog operations.",
    );
  const random = source(seed),
    samples: number[] = [];
  let current = start,
    accepted = 0;
  for (let i = 0; i < count; i++) {
    const momentum = normalSample(random);
    let x = current,
      p = momentum - (stepSize * current) / 2;
    for (let j = 0; j < leapfrogSteps; j++) {
      x += stepSize * p;
      p -= stepSize * x * (j === leapfrogSteps - 1 ? 0.5 : 1);
    }
    const oldEnergy = (current * current + momentum * momentum) / 2;
    const newEnergy = (x * x + p * p) / 2;
    if (
      Number.isFinite(x) &&
      Math.log(unitRandom(random)) < Math.min(0, oldEnergy - newEnergy)
    ) {
      current = x;
      accepted++;
    }
    samples.push(current);
  }
  return { samples, acceptanceRate: accepted / count };
};

export const sampleImportance = (
  proposalValues: number[],
  targetWeights: number[],
  count: number,
  seed: string,
) => {
  requireCount(count);
  if (
    proposalValues.length !== targetWeights.length ||
    targetWeights.some((v) => v < 0)
  )
    simpleError(
      "targetWeights",
      "Proposal and target arrays must match and be nonnegative.",
    );
  const proposal = probabilities(proposalValues),
    target = probabilities(targetWeights);
  if (target.some((v, i) => v > 0 && proposal[i] === 0))
    simpleError(
      "proposal",
      "Proposal must have support wherever target has positive mass.",
    );
  const random = source(seed),
    sampleIndices: number[] = [],
    weights: number[] = [];
  for (let i = 0; i < count; i++) {
    const index = drawIndex(proposal, random);
    sampleIndices.push(index);
    weights.push(target[index]! / proposal[index]!);
  }
  return { sampleIndices, weights };
};

export const sampleSliceNormal = (
  start: number,
  width: number,
  count: number,
  seed: string,
) => {
  requireCount(count);
  if (!(width > 0)) simpleError("width", "Slice width must be positive.");
  const random = source(seed),
    samples: number[] = [];
  let current = start;
  for (let i = 0; i < count; i++) {
    const logHeight = (-current * current) / 2 + Math.log(unitRandom(random));
    let left = current - width * unitRandom(random),
      right = left + width;
    for (let j = 0; j < 100 && (-left * left) / 2 > logHeight; j++)
      left -= width;
    for (let j = 0; j < 100 && (-right * right) / 2 > logHeight; j++)
      right += width;
    let accepted = false;
    for (let j = 0; j < 10000; j++) {
      const candidate = left + (right - left) * unitRandom(random);
      if ((-candidate * candidate) / 2 >= logHeight) {
        current = candidate;
        accepted = true;
        break;
      }
      if (candidate < current) left = candidate;
      else right = candidate;
    }
    if (!accepted)
      simpleError(
        "width",
        "Slice sampler failed to find a point within 10,000 proposals.",
      );
    samples.push(current);
  }
  return { samples };
};

export const sampleNegativeBinomialPoissonMixture = (
  shape: number,
  successProbability: number,
  count: number,
  seed: string,
) => {
  requireCount(count);
  if (
    !(shape > 0) ||
    !(successProbability > 0 && successProbability <= 1) ||
    (shape * (1 - successProbability)) / successProbability > 100
  )
    simpleError(
      "successProbability",
      "Use positive shape and probability in (0,1] with mean Poisson rate at most 100.",
    );
  const random = source(seed),
    rates: number[] = [],
    samples: number[] = [];
  for (let i = 0; i < count; i++) {
    const rate =
      successProbability === 1
        ? 0
        : (gammaSample(shape, random) * (1 - successProbability)) /
          successProbability;
    if (rate > 700)
      simpleError(
        "shape",
        "A sampled Poisson rate exceeds the exact sampler's supported range.",
        "resource_limit",
      );
    let product = 1,
      events = 0;
    const threshold = Math.exp(-rate);
    do {
      product *= unitRandom(random);
      events++;
    } while (product > threshold);
    rates.push(rate);
    samples.push(events - 1);
  }
  return { rates, samples };
};

export const sampleSequentialMonteCarlo = (
  observations: number[],
  particleCount: number,
  processStandardDeviation: number,
  observationStandardDeviation: number,
  initialStandardDeviation: number,
  seed: string,
) => {
  if (
    !observations.length ||
    observations.length > 100 ||
    particleCount < 10 ||
    particleCount > 1000 ||
    observations.length * particleCount > 100000
  )
    simpleError(
      "observations",
      "Use 1–100 observations and 10–1000 particles with at most 100,000 updates.",
    );
  if (!(
    processStandardDeviation > 0 &&
    observationStandardDeviation > 0 &&
    initialStandardDeviation > 0
  ))
    simpleError(
      "processStandardDeviation",
      "All standard deviations must be positive.",
    );
  const random = source(seed),
    posteriorMeans: number[] = [];
  let particles = Array.from(
    { length: particleCount },
    () => initialStandardDeviation * normalSample(random),
  );
  for (const observation of observations) {
    particles = particles.map(
      (value) => value + processStandardDeviation * normalSample(random),
    );
    const logWeights = particles.map(
      (value) =>
        -0.5 * ((observation - value) / observationStandardDeviation) ** 2,
    );
    const maxLog = Math.max(...logWeights);
    const weights = logWeights.map((value) => Math.exp(value - maxLog));
    const total = weights.reduce((a, b) => a + b, 0);
    if (!(total > 0) || !Number.isFinite(total))
      simpleError(
        "observations",
        "Particle weights underflowed or overflowed.",
      );
    posteriorMeans.push(
      particles.reduce((sum, value, i) => sum + value * weights[i]!, 0) / total,
    );
    const cumulative: number[] = [];
    let running = 0;
    for (const weight of weights) {
      running += weight / total;
      cumulative.push(running);
    }
    const offset = unitRandom(random) / particleCount;
    let position = 0;
    particles = Array.from({ length: particleCount }, (_, i) => {
      const threshold = offset + i / particleCount;
      while (
        position < cumulative.length - 1 &&
        cumulative[position]! < threshold
      )
        position++;
      return particles[position]!;
    });
  }
  return { posteriorMeans, finalParticles: particles };
};
