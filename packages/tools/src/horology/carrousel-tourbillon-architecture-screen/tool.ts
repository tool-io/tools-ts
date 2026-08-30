import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RotatingArchitectureInput = {
  readonly cageCoupledToSecondsHand: boolean;
  readonly cageRotationPeriodSeconds: number;
  readonly regulatorMountedInCage: boolean;
};

export type RotatingArchitectureOutput = {
  readonly architectureScreen:
    "carrouselLike" | "notARotatingRegulator" | "tourbillonLike";
  readonly cageRevolutionsPerDay: number;
  readonly classificationCaution: string;
};

export const screenCarrouselTourbillonArchitecture = (
  input: RotatingArchitectureInput,
): RotatingArchitectureOutput => {
  if (
    !Number.isFinite(input.cageRotationPeriodSeconds) ||
    input.cageRotationPeriodSeconds <= 0
  )
    simpleError(
      "cageRotationPeriodSeconds",
      "Cage period must be finite and positive.",
      "cage_period_invalid",
    );
  const cageRevolutionsPerDay = 86_400 / input.cageRotationPeriodSeconds;
  if (!Number.isFinite(cageRevolutionsPerDay))
    simpleError("", "Cage rotation rate is not finite.", "result_not_finite");
  if (!input.regulatorMountedInCage)
    return {
      architectureScreen: "notARotatingRegulator",
      cageRevolutionsPerDay,
      classificationCaution:
        "The supplied architecture does not place the balance and escapement in the rotating cage.",
    };
  return {
    architectureScreen: input.cageCoupledToSecondsHand
      ? "tourbillonLike"
      : "carrouselLike",
    cageRevolutionsPerDay,
    classificationCaution:
      "This is a feature-based architecture screen; specific calibers can combine features or use nonstandard drive arrangements.",
  };
};

export const rotatingArchitectureExample = {
  input: {
    cageCoupledToSecondsHand: true,
    cageRotationPeriodSeconds: 60,
    regulatorMountedInCage: true,
  },
  output: {
    architectureScreen: "tourbillonLike",
    cageRevolutionsPerDay: 1440,
    classificationCaution:
      "This is a feature-based architecture screen; specific calibers can combine features or use nonstandard drive arrangements.",
  },
} satisfies ToolExample<RotatingArchitectureInput, RotatingArchitectureOutput>;

export const rotatingArchitectureTool = createSimpleTool({
  calculate: (input) =>
    screenCarrouselTourbillonArchitecture({
      cageCoupledToSecondsHand: input.cageCoupledToSecondsHand as boolean,
      cageRotationPeriodSeconds: input.cageRotationPeriodSeconds as number,
      regulatorMountedInCage: input.regulatorMountedInCage as boolean,
    }),
  description:
    "Screen a rotating regulator as tourbillon-like or carrousel-like from supplied cage and seconds-hand architecture features.",
  id: "horology/carrousel-tourbillon-architecture-screen",
  inputs: [
    {
      id: "cageCoupledToSecondsHand",
      kind: "boolean",
      label: "Cage coupled to seconds indication",
    },
    {
      id: "cageRotationPeriodSeconds",
      kind: "number",
      label: "Cage rotation period",
      minimum: 0,
      unit: "s",
    },
    {
      id: "regulatorMountedInCage",
      kind: "boolean",
      label: "Balance and escapement mounted in cage",
    },
  ],
  outputs: [
    {
      enum: ["tourbillonLike", "carrouselLike", "notARotatingRegulator"],
      id: "architectureScreen",
      kind: "string",
      label: "Rotating architecture screen",
    },
    {
      id: "cageRevolutionsPerDay",
      kind: "number",
      label: "Cage revolutions per day",
      minimum: 0,
      unit: "rev/day",
    },
    {
      id: "classificationCaution",
      kind: "string",
      label: "Classification caution",
    },
  ],
  title: "Carrousel Tourbillon Architecture Screen",
});

export const runRotatingArchitecture = rotatingArchitectureTool.execute;
export default rotatingArchitectureTool;
