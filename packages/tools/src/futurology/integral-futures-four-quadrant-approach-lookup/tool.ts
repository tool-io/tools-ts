import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const quadrants = {
  lowerLeft: {
    caution:
      "Repressive change can hide participation and costs in the name of order.",
    focus: "The material and institutional world that constrains life.",
    question: "Which structural constraints most limit human flourishing?",
  },
  lowerRight: {
    caution:
      "Externalization can move ecological or social costs outside the observed boundary.",
    focus: "The material and institutional world that enables life.",
    question:
      "Which conditions should be strengthened without increasing hidden harm?",
  },
  upperLeft: {
    caution:
      "Subjective certainty can crowd out evidence and collective inquiry.",
    focus: "Interior awareness and collective meaning.",
    question:
      "Which values, assumptions, or emotional patterns shape the choice?",
  },
  upperRight: {
    caution:
      "High aspiration can become abstraction when it lacks relationships and material action.",
    focus: "Agency, meaning, and intentional collective action.",
    question:
      "Which actor could move a valued possibility into an achievable pathway?",
  },
} as const;

export type IntegralQuadrant = keyof typeof quadrants;

export type IntegralFuturesInput = {
  readonly quadrant: IntegralQuadrant;
};

export type IntegralFuturesOutput = {
  readonly caution: string;
  readonly focus: string;
  readonly guidingQuestion: string;
  readonly quadrant: IntegralQuadrant;
};

export const lookupIntegralFuturesQuadrant = (
  input: IntegralFuturesInput,
): IntegralFuturesOutput => {
  const quadrant = quadrants[input.quadrant];
  if (quadrant === undefined)
    simpleError(
      "quadrant",
      "Integral futures quadrant is not supported.",
      "unsupported_integral_quadrant",
    );
  return {
    caution: quadrant.caution,
    focus: quadrant.focus,
    guidingQuestion: quadrant.question,
    quadrant: input.quadrant,
  };
};

export const integralFuturesExample = {
  input: { quadrant: "lowerLeft" },
  output: {
    caution:
      "Repressive change can hide participation and costs in the name of order.",
    focus: "The material and institutional world that constrains life.",
    guidingQuestion:
      "Which structural constraints most limit human flourishing?",
    quadrant: "lowerLeft",
  },
} satisfies ToolExample<IntegralFuturesInput, IntegralFuturesOutput>;

export const integralFuturesTool = createSimpleTool({
  calculate: (input) =>
    lookupIntegralFuturesQuadrant({
      quadrant: input.quadrant as IntegralQuadrant,
    }),
  description:
    "Return the focus, guiding question, and caution for one quadrant of a four-quadrant integral futures approach.",
  id: "futurology/integral-futures-four-quadrant-approach-lookup",
  inputs: [
    {
      enum: ["upperRight", "upperLeft", "lowerLeft", "lowerRight"],
      id: "quadrant",
      kind: "string",
      label: "Integral futures quadrant",
    },
  ],
  outputs: [
    { id: "caution", kind: "string", label: "Quadrant caution" },
    { id: "focus", kind: "string", label: "Quadrant focus" },
    { id: "guidingQuestion", kind: "string", label: "Guiding question" },
    { id: "quadrant", kind: "string", label: "Integral futures quadrant" },
  ],
  title: "Integral Futures Four Quadrant Approach Lookup",
});

export const runIntegralFutures = integralFuturesTool.execute;
export default integralFuturesTool;
