import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DealGroveInput = {
  readonly aNm: number;
  readonly bNm2PerHour: number;
  readonly timeHours: number;
};

export type DealGroveOutput = {
  readonly oxideThicknessNm: number;
};

export const dealGroveExample = {
  input: { aNm: 20, bNm2PerHour: 0.4, timeHours: 100 },
  output: { oxideThicknessNm: 1.8321595661992323 },
} satisfies ToolExample<DealGroveInput, DealGroveOutput>;

export const calculateDealGrove = (input: DealGroveInput): DealGroveOutput => {
  const aNm = input.aNm;
  const bNm2PerHour = input.bNm2PerHour;
  const timeHours = input.timeHours;

  if (!Number.isFinite(aNm) || aNm < 0)
    simpleError(
      "aNm",
      "Linear rate constant A must be a finite number at least 0.",
      "invalid_a",
    );
  if (!Number.isFinite(bNm2PerHour) || bNm2PerHour <= 0)
    simpleError(
      "bNm2PerHour",
      "Parabolic rate constant B must be a finite positive number.",
      "invalid_b",
    );
  if (!Number.isFinite(timeHours) || timeHours < 0)
    simpleError(
      "timeHours",
      "Oxidation time must be a finite number at least 0.",
      "invalid_time",
    );

  const parabolicTerm = bNm2PerHour * timeHours;
  const sqrtParabolicTerm = Math.sqrt(bNm2PerHour) * Math.sqrt(timeHours);
  if (timeHours > 0 && sqrtParabolicTerm === 0)
    simpleError(
      "timeHours",
      "Oxide thickness is below the positive finite numeric range.",
      "numeric_range",
    );
  // Rationalizing the positive quadratic root avoids subtracting two nearly
  // equal values when B*t is small relative to A².
  const root = Math.hypot(
    aNm,
    2 *
      (Number.isFinite(parabolicTerm) && parabolicTerm > 0
        ? Math.sqrt(parabolicTerm)
        : sqrtParabolicTerm),
  );
  const oxideThicknessNm =
    timeHours === 0
      ? 0
      : Number.isFinite(parabolicTerm) && parabolicTerm > 0
        ? parabolicTerm / (root / 2 + aNm / 2)
        : sqrtParabolicTerm * (sqrtParabolicTerm / (root / 2 + aNm / 2));
  if (
    !Number.isFinite(oxideThicknessNm) ||
    (timeHours > 0 && oxideThicknessNm === 0)
  )
    simpleError(
      "timeHours",
      "Oxide thickness is outside the finite numeric range.",
      "numeric_range",
    );
  return {
    oxideThicknessNm: oxideThicknessNm === 0 ? 0 : oxideThicknessNm,
  };
};

export const dealGroveTool = createSimpleTool({
  calculate: (input) =>
    calculateDealGrove({
      aNm: input.aNm as number,
      bNm2PerHour: input.bNm2PerHour as number,
      timeHours: input.timeHours as number,
    }),
  description:
    "Solve the zero-initial-thickness Deal-Grove relation x² + A·x = B·t for thermal oxide thickness.",
  id: "semiconductor/oxidation-rate-deal-grove",
  inputs: [
    {
      description:
        "Linear rate constant A of the Deal-Grove model. Must be at least 0 nm.",
      id: "aNm",
      kind: "number",
      label: "Linear rate constant A",
      minimum: 0,
      unit: "nm",
    },
    {
      description:
        "Parabolic rate constant B of the Deal-Grove model. Must be greater than 0 nm²/hour.",
      id: "bNm2PerHour",
      kind: "number",
      label: "Parabolic rate constant B",
      minimum: Number.MIN_VALUE,
      unit: "nm^2/hour",
    },
    {
      description:
        "Duration of the thermal oxidation. Must be at least 0 hour; 0 yields 0 nm.",
      id: "timeHours",
      kind: "number",
      label: "Oxidation time",
      minimum: 0,
      unit: "hour",
    },
  ],
  outputs: [
    {
      description:
        "Thermal oxide thickness from the zero-initial-thickness Deal-Grove solution.",
      id: "oxideThicknessNm",
      kind: "number",
      label: "Oxide thickness",
      minimum: 0,
      unit: "nm",
    },
  ],
  title: "Deal-Grove Thickness Calculator",
});
export const runDealGrove = dealGroveTool.execute;
export default dealGroveTool;
