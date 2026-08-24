import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PseudomorphicCriticalThicknessMatthewsBlakesleeInput = {
  readonly burgersVectorNm: number;
  readonly dislocationLineAngleDegrees: number;
  readonly mismatchFraction: number;
  readonly poissonRatio: number;
  readonly slipDirectionAngleDegrees: number;
};

export type PseudomorphicCriticalThicknessMatthewsBlakesleeOutput = {
  readonly criticalThicknessNm: number;
};

const degreesToRadians = (degrees: number): number => (degrees * Math.PI) / 180;

export const calculatePseudomorphicCriticalThicknessMatthewsBlakeslee = (
  input: PseudomorphicCriticalThicknessMatthewsBlakesleeInput,
): PseudomorphicCriticalThicknessMatthewsBlakesleeOutput => {
  const mismatch = Math.abs(input.mismatchFraction);
  if (!Number.isFinite(mismatch) || mismatch <= 0 || mismatch >= 0.2)
    simpleError(
      "mismatchFraction",
      "Mismatch magnitude must be greater than zero and below 0.2.",
      "outside_model_range",
    );
  if (!Number.isFinite(input.burgersVectorNm) || input.burgersVectorNm <= 0)
    simpleError(
      "burgersVectorNm",
      "Burgers-vector magnitude must be positive.",
    );
  if (
    !Number.isFinite(input.poissonRatio) ||
    input.poissonRatio < 0 ||
    input.poissonRatio >= 0.5
  )
    simpleError(
      "poissonRatio",
      "Poisson ratio must be at least zero and below 0.5.",
    );
  if (
    !Number.isFinite(input.dislocationLineAngleDegrees) ||
    input.dislocationLineAngleDegrees < 0 ||
    input.dislocationLineAngleDegrees > 180
  )
    simpleError(
      "dislocationLineAngleDegrees",
      "Dislocation-line angle must be between 0 and 180 degrees.",
    );
  if (
    !Number.isFinite(input.slipDirectionAngleDegrees) ||
    input.slipDirectionAngleDegrees < 0 ||
    input.slipDirectionAngleDegrees >= 90
  )
    simpleError(
      "slipDirectionAngleDegrees",
      "Slip-direction angle must be at least zero and below 90 degrees.",
    );

  const lineAngle = degreesToRadians(input.dislocationLineAngleDegrees);
  const slipAngle = degreesToRadians(input.slipDirectionAngleDegrees);
  const geometryFactor =
    (1 - input.poissonRatio * Math.cos(lineAngle) ** 2) /
    ((1 + input.poissonRatio) * Math.cos(slipAngle));
  const coefficientNm =
    (input.burgersVectorNm * geometryFactor) / (4 * Math.PI * mismatch);

  if (coefficientNm / input.burgersVectorNm < Math.E)
    simpleError(
      "mismatchFraction",
      "The continuum equation has no critical-thickness root above the dislocation core for these parameters.",
      "no_continuum_solution",
    );

  const residual = (thicknessNm: number): number =>
    thicknessNm - coefficientNm * Math.log(thicknessNm / input.burgersVectorNm);
  let lower = coefficientNm;
  let upper = 2 * coefficientNm;
  while (residual(upper) <= 0) {
    upper *= 2;
    if (!Number.isFinite(upper))
      simpleError(
        "mismatchFraction",
        "Critical thickness is outside the representable range.",
        "numeric_range",
      );
  }
  for (let iteration = 0; iteration < 100; iteration += 1) {
    const midpoint = (lower + upper) / 2;
    if (residual(midpoint) > 0) upper = midpoint;
    else lower = midpoint;
  }
  return { criticalThicknessNm: (lower + upper) / 2 };
};

export const pseudomorphicCriticalThicknessMatthewsBlakesleeExample = {
  input: {
    burgersVectorNm: 0.4,
    dislocationLineAngleDegrees: 60,
    mismatchFraction: -0.01,
    poissonRatio: 0.31,
    slipDirectionAngleDegrees: 60,
  },
  output: { criticalThicknessNm: 16.740249462329892 },
} satisfies ToolExample<
  PseudomorphicCriticalThicknessMatthewsBlakesleeInput,
  PseudomorphicCriticalThicknessMatthewsBlakesleeOutput
>;

export const pseudomorphicCriticalThicknessMatthewsBlakesleeTool =
  createSimpleTool({
    id: "semiconductor/pseudomorphic-critical-thickness-matthews-blakeslee",
    title: "Matthews-Blakeslee Critical Thickness Calculator",
    description:
      "Solve the isotropic Matthews-Blakeslee force-balance equation for the upper physical critical-thickness root, including Poisson ratio and dislocation geometry.",
    inputs: [
      {
        description:
          "Signed film/substrate lattice mismatch; only its magnitude enters the force-balance equation.",
        id: "mismatchFraction",
        kind: "number",
        label: "Mismatch",
        maximum: 0.2,
        minimum: -0.2,
      },
      {
        description: "Magnitude of the active dislocation Burgers vector.",
        id: "burgersVectorNm",
        kind: "number",
        label: "Burgers vector",
        minimum: Number.MIN_VALUE,
        unit: "nm",
      },
      {
        description: "Isotropic Poisson ratio of the strained material.",
        id: "poissonRatio",
        kind: "number",
        label: "Poisson ratio",
        minimum: 0,
      },
      {
        description:
          "Angle between the Burgers vector and dislocation line; commonly 60 degrees for zinc-blende 60-degree dislocations.",
        id: "dislocationLineAngleDegrees",
        kind: "number",
        label: "Dislocation-line angle",
        maximum: 180,
        minimum: 0,
        unit: "deg",
      },
      {
        description:
          "Angle between the slip direction and interface-normal direction used by the force-balance geometry.",
        id: "slipDirectionAngleDegrees",
        kind: "number",
        label: "Slip-direction angle",
        minimum: 0,
        unit: "deg",
      },
    ],
    outputs: [
      {
        description:
          "Upper solution of h=A ln(h/b), representing the continuum critical thickness.",
        id: "criticalThicknessNm",
        kind: "number",
        label: "Critical thickness",
        minimum: Number.MIN_VALUE,
        unit: "nm",
      },
    ],
    calculate: (input) =>
      calculatePseudomorphicCriticalThicknessMatthewsBlakeslee({
        burgersVectorNm: input.burgersVectorNm as number,
        dislocationLineAngleDegrees:
          input.dislocationLineAngleDegrees as number,
        mismatchFraction: input.mismatchFraction as number,
        poissonRatio: input.poissonRatio as number,
        slipDirectionAngleDegrees: input.slipDirectionAngleDegrees as number,
      }),
  });
export const runPseudomorphicCriticalThicknessMatthewsBlakeslee =
  pseudomorphicCriticalThicknessMatthewsBlakesleeTool.execute;
export default pseudomorphicCriticalThicknessMatthewsBlakesleeTool;
