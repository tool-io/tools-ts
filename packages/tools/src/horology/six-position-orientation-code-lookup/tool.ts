import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const positions = {
  "12H": {
    orientation: "crown right",
    positionGroup: "vertical",
  },
  "3H": {
    orientation: "crown up",
    positionGroup: "vertical",
  },
  "6H": {
    orientation: "crown left",
    positionGroup: "vertical",
  },
  "9H": {
    orientation: "crown down",
    positionGroup: "vertical",
  },
  CB: {
    orientation: "dial down",
    positionGroup: "horizontal",
  },
  CH: {
    orientation: "dial up",
    positionGroup: "horizontal",
  },
} as const;

export type SixPositionCode = keyof typeof positions;

export type SixPositionLookupInput = {
  readonly positionCode: SixPositionCode;
};

export type SixPositionLookupOutput = {
  readonly certificationCaution: string;
  readonly orientation: string;
  readonly positionCode: SixPositionCode;
  readonly positionGroup: string;
};

export const lookupSixPositionOrientation = (
  input: SixPositionLookupInput,
): SixPositionLookupOutput => {
  const position = positions[input.positionCode];
  if (position === undefined)
    simpleError(
      "positionCode",
      "Six-position test code is not supported.",
      "unsupported_position_code",
    );
  return {
    certificationCaution:
      "These six workshop orientations are not the five-position ISO 3159 chronometer list; do not treat a six-position stamp as a COSC certification claim.",
    orientation: position.orientation,
    positionCode: input.positionCode,
    positionGroup: position.positionGroup,
  };
};

export const sixPositionExample = {
  input: { positionCode: "9H" },
  output: {
    certificationCaution:
      "These six workshop orientations are not the five-position ISO 3159 chronometer list; do not treat a six-position stamp as a COSC certification claim.",
    orientation: "crown down",
    positionCode: "9H",
    positionGroup: "vertical",
  },
} satisfies ToolExample<SixPositionLookupInput, SixPositionLookupOutput>;

export const sixPositionTool = createSimpleTool({
  calculate: (input) =>
    lookupSixPositionOrientation({
      positionCode: input.positionCode as SixPositionCode,
    }),
  description:
    "Map the CH, CB, 9H, 6H, 3H, and 12H workshop test codes to physical orientations while separating them from the five-position COSC procedure.",
  id: "horology/six-position-orientation-code-lookup",
  inputs: [
    {
      enum: ["CH", "CB", "9H", "6H", "3H", "12H"],
      id: "positionCode",
      kind: "string",
      label: "Six-position workshop test code",
    },
  ],
  outputs: [
    {
      id: "certificationCaution",
      kind: "string",
      label: "Certification caution",
    },
    { id: "orientation", kind: "string", label: "Physical watch orientation" },
    {
      id: "positionCode",
      kind: "string",
      label: "Six-position workshop test code",
    },
    { id: "positionGroup", kind: "string", label: "Position group" },
  ],
  title: "Six Position Orientation Code Lookup",
});

export const runSixPosition = sixPositionTool.execute;
export default sixPositionTool;
