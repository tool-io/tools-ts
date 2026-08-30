import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const directions = {
  alternating: {
    description:
      "the winder reverses direction according to its programmed cycle",
    setting: "alternating",
  },
  clockwise: {
    description: "the winder rotates continuously in the clockwise setting",
    setting: "clockwise",
  },
  counterclockwise: {
    description:
      "the winder rotates continuously in the counterclockwise setting",
    setting: "counterclockwise",
  },
} as const;

export type WinderDirection = keyof typeof directions;

export type WinderDirectionLookupInput = {
  readonly winderDirection: WinderDirection;
};

export type WinderDirectionLookupOutput = {
  readonly directionCaution: string;
  readonly description: string;
  readonly winderDirection: WinderDirection;
};

export const lookupWinderRotationDirection = (
  input: WinderDirectionLookupInput,
): WinderDirectionLookupOutput => {
  const direction = directions[input.winderDirection];
  if (direction === undefined)
    simpleError(
      "winderDirection",
      "Winder direction is not supported.",
      "unsupported_winder_direction",
    );
  return {
    directionCaution:
      "There is no universal TPD rule for every movement. Follow the manufacturer or movement guidance and the winder manual; setting labels and physical rotation can differ between devices.",
    description: direction.description,
    winderDirection: input.winderDirection,
  };
};

export const winderDirectionExample = {
  input: { winderDirection: "alternating" },
  output: {
    directionCaution:
      "There is no universal TPD rule for every movement. Follow the manufacturer or movement guidance and the winder manual; setting labels and physical rotation can differ between devices.",
    description:
      "the winder reverses direction according to its programmed cycle",
    winderDirection: "alternating",
  },
} satisfies ToolExample<
  WinderDirectionLookupInput,
  WinderDirectionLookupOutput
>;

export const winderDirectionTool = createSimpleTool({
  calculate: (input) =>
    lookupWinderRotationDirection({
      winderDirection: input.winderDirection as WinderDirection,
    }),
  description:
    "Return clockwise, counterclockwise, or programmed alternating winder direction while withholding a universal turns-per-day setting.",
  id: "horology/watch-winder-rotation-direction-lookup",
  inputs: [
    {
      enum: ["clockwise", "counterclockwise", "alternating"],
      id: "winderDirection",
      kind: "string",
      label: "Watch-winder rotation direction",
    },
  ],
  outputs: [
    { id: "directionCaution", kind: "string", label: "Winder-setting caution" },
    {
      id: "description",
      kind: "string",
      label: "Winder direction description",
    },
    {
      id: "winderDirection",
      kind: "string",
      label: "Watch-winder rotation direction",
    },
  ],
  title: "Watch Winder Rotation Direction Lookup",
});

export const runWinderDirection = winderDirectionTool.execute;
export default winderDirectionTool;
