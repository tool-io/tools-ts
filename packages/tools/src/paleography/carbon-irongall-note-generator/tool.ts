import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CarbonIrongallNoteGeneratorInput = {
  readonly opaqueBlackCore?: boolean;
  readonly reflectographyStaysBlack?: boolean;
  readonly waterSmudgeResistant?: boolean;
  readonly brownEdgeTinge?: boolean;
  readonly haloBleeding?: boolean;
  readonly corrosionHoles?: boolean;
};

export type CarbonIrongallNoteGeneratorOutput = {
  readonly carbonSignCount: number;
  readonly irongallSignCount: number;
  readonly verdict:
    "carbon_indicated" | "iron_gall_indicated" | "mixed_indications";
  readonly note: string;
};

const CARBON_KEYS = [
  "opaqueBlackCore",
  "reflectographyStaysBlack",
  "waterSmudgeResistant",
] as const;
const IRONGALL_KEYS = [
  "brownEdgeTinge",
  "haloBleeding",
  "corrosionHoles",
] as const;

export const calculateCarbonIrongallNoteGenerator = (
  input: CarbonIrongallNoteGeneratorInput,
): CarbonIrongallNoteGeneratorOutput => {
  const carbonSignCount = CARBON_KEYS.filter(
    (key) => input[key] === true,
  ).length;
  const irongallSignCount = IRONGALL_KEYS.filter(
    (key) => input[key] === true,
  ).length;
  const verdict =
    carbonSignCount > irongallSignCount
      ? "carbon_indicated"
      : irongallSignCount > carbonSignCount
        ? "iron_gall_indicated"
        : "mixed_indications";
  const note =
    verdict === "carbon_indicated"
      ? `Carbon-based ink indicated (${carbonSignCount} carbon-typical versus ${irongallSignCount} iron-gall-typical signs).`
      : verdict === "iron_gall_indicated"
        ? `Iron-gall ink indicated (${irongallSignCount} iron-gall-typical versus ${carbonSignCount} carbon-typical signs).`
        : `Mixed or unclear indications (${carbonSignCount} carbon-typical and ${irongallSignCount} iron-gall-typical signs); confirm with non-destructive instrumental analysis.`;
  return { carbonSignCount, irongallSignCount, verdict, note };
};

export const carbonIrongallNoteGeneratorExample = {
  input: {
    opaqueBlackCore: true,
    reflectographyStaysBlack: true,
    waterSmudgeResistant: true,
    brownEdgeTinge: false,
    haloBleeding: false,
    corrosionHoles: false,
  },
  output: {
    carbonSignCount: 3,
    irongallSignCount: 0,
    verdict: "carbon_indicated",
    note: "Carbon-based ink indicated (3 carbon-typical versus 0 iron-gall-typical signs).",
  },
} satisfies ToolExample<
  CarbonIrongallNoteGeneratorInput,
  CarbonIrongallNoteGeneratorOutput
>;

export const carbonIrongallNoteGeneratorTool = createSimpleTool({
  id: "paleography/carbon-irongall-note-generator",
  title: "Carbon / Iron-Gall Note Generator",
  description:
    "Generate a condition-note verdict for carbon versus iron-gall ink under the stated counting rule: three documented carbon traits (opaque black core, black in reflectography, water-smudge resistant) are counted against three documented iron-gall traits (brown edge tinge, halo bleeding, corrosion holes), and the majority side wins while a tie yields 'mixed indications'.",
  inputs: [
    {
      default: false,
      description: "Core of the stroke reads as opaque black.",
      id: "opaqueBlackCore",
      kind: "boolean",
      label: "Opaque black core",
    },
    {
      default: false,
      description: "Ink remains black under UV/IR reflectography.",
      id: "reflectographyStaysBlack",
      kind: "boolean",
      label: "Black in reflectography",
    },
    {
      default: false,
      description:
        "An existing condition record reports water-smudge resistance; do not apply water to the manuscript to obtain this observation.",
      id: "waterSmudgeResistant",
      kind: "boolean",
      label: "Water resistant",
    },
    {
      default: false,
      description: "Aged strokes show a brown tinge at edges.",
      id: "brownEdgeTinge",
      kind: "boolean",
      label: "Brown edge tinge",
    },
    {
      default: false,
      description: "Brown halo bleeds into the support.",
      id: "haloBleeding",
      kind: "boolean",
      label: "Halo bleeding",
    },
    {
      default: false,
      description: "Support shows corrosion holes or losses along strokes.",
      id: "corrosionHoles",
      kind: "boolean",
      label: "Corrosion holes",
    },
  ],
  outputs: [
    {
      description: "Count of observed carbon-typical signs.",
      id: "carbonSignCount",
      kind: "integer",
      label: "Carbon signs",
    },
    {
      description: "Count of observed iron-gall-typical signs.",
      id: "irongallSignCount",
      kind: "integer",
      label: "Iron-gall signs",
    },
    {
      description: "Majority verdict across the six documented signs.",
      id: "verdict",
      enum: ["carbon_indicated", "iron_gall_indicated", "mixed_indications"],
      kind: "string",
      label: "Verdict",
    },
    {
      description:
        "Ready-to-paste catalogue note stating the counts and verdict.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  calculate: (input) =>
    calculateCarbonIrongallNoteGenerator({
      brownEdgeTinge: input.brownEdgeTinge as boolean | undefined,
      corrosionHoles: input.corrosionHoles as boolean | undefined,
      haloBleeding: input.haloBleeding as boolean | undefined,
      opaqueBlackCore: input.opaqueBlackCore as boolean | undefined,
      reflectographyStaysBlack: input.reflectographyStaysBlack as
        boolean | undefined,
      waterSmudgeResistant: input.waterSmudgeResistant as boolean | undefined,
    }),
});

export const runCarbonIrongallNoteGenerator =
  carbonIrongallNoteGeneratorTool.execute;
export default carbonIrongallNoteGeneratorTool;
