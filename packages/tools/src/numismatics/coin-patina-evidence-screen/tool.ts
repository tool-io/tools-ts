import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly cleaningScratches: boolean;
  readonly localizedMineralDeposits: boolean;
  readonly soilAdhesion: boolean;
  readonly uniformCabinetTone: boolean;
}>;
export type Output = Readonly<{
  readonly classification:
    | "burial-associated-evidence"
    | "collection-tone-evidence"
    | "mixed-evidence"
    | "insufficient-evidence";
  readonly evidenceCount: number;
}>;

export const calculate = (input: Input): Output => {
  const burialCount =
    Number(input.localizedMineralDeposits) + Number(input.soilAdhesion);
  const collectionCount =
    Number(input.uniformCabinetTone) + Number(input.cleaningScratches);
  const evidenceCount = burialCount + collectionCount;
  const classification =
    evidenceCount === 0
      ? "insufficient-evidence"
      : burialCount > 0 && collectionCount > 0
        ? "mixed-evidence"
        : burialCount > 0
          ? "burial-associated-evidence"
          : "collection-tone-evidence";
  return { classification, evidenceCount };
};

export const example = {
  input: {
    cleaningScratches: false,
    localizedMineralDeposits: true,
    soilAdhesion: true,
    uniformCabinetTone: false,
  },
  output: { classification: "burial-associated-evidence", evidenceCount: 2 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    cleaningScratches: true,
    localizedMineralDeposits: true,
    soilAdhesion: false,
    uniformCabinetTone: false,
  },
  output: { classification: "mixed-evidence", evidenceCount: 2 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      cleaningScratches: input.cleaningScratches as boolean,
      localizedMineralDeposits: input.localizedMineralDeposits as boolean,
      soilAdhesion: input.soilAdhesion as boolean,
      uniformCabinetTone: input.uniformCabinetTone as boolean,
    }),
  description:
    "Organize visible patina and cleaning evidence without claiming that “desert” or “hoard” appearance proves find context, authenticity, or provenance.",
  id: "numismatics/coin-patina-evidence-screen",
  inputs: [
    {
      id: "cleaningScratches",
      kind: "boolean",
      label: "Cleaning scratches observed",
    },
    {
      id: "localizedMineralDeposits",
      kind: "boolean",
      label: "Localized mineral deposits observed",
    },
    { id: "soilAdhesion", kind: "boolean", label: "Soil adhesion observed" },
    {
      id: "uniformCabinetTone",
      kind: "boolean",
      label: "Uniform cabinet tone observed",
    },
  ],
  outputs: [
    {
      id: "classification",
      kind: "string",
      label: "Evidence classification",
      enum: [
        "burial-associated-evidence",
        "collection-tone-evidence",
        "mixed-evidence",
        "insufficient-evidence",
      ],
    },
    {
      id: "evidenceCount",
      kind: "integer",
      label: "Observed evidence count",
      minimum: 0,
      maximum: 4,
    },
  ],
  title: "Coin Patina Evidence Screen",
});

export const run = tool.execute;
export default tool;
