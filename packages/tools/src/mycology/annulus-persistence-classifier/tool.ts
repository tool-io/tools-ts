import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const PERSISTENCE_STATES = [
  "persistent",
  "fugacious",
  "evanescent",
  "absent",
] as const;

export type AnnulusPersistenceClassifierInput = {
  readonly persistence: (typeof PERSISTENCE_STATES)[number];
};

export type AnnulusPersistenceClassifierOutput = {
  readonly interpretation: string;
  readonly persistenceClass: AnnulusPersistenceClassifierInput["persistence"];
};

export const annulusPersistenceClassifierExample = {
  input: { persistence: "persistent" },
  output: {
    interpretation: "Annulus remains evident on mature fruiting bodies.",
    persistenceClass: "persistent",
  },
} satisfies ToolExample<
  AnnulusPersistenceClassifierInput,
  AnnulusPersistenceClassifierOutput
>;

const INTERPRETATIONS: Record<
  AnnulusPersistenceClassifierInput["persistence"],
  string
> = {
  absent: "No annulus was observed on the stipe.",
  evanescent:
    "Annulus disappears very early and may leave little visible trace.",
  fugacious:
    "Annulus is short-lived and commonly disappears as the cap expands.",
  persistent: "Annulus remains evident on mature fruiting bodies.",
};

export const calculateAnnulusPersistenceClassifier = (
  input: AnnulusPersistenceClassifierInput,
): AnnulusPersistenceClassifierOutput => {
  const interpretation = INTERPRETATIONS[input.persistence];
  if (interpretation === undefined)
    return simpleError(
      "persistence",
      "Select a supported annulus persistence state.",
      "invalid_persistence",
    );
  return { interpretation, persistenceClass: input.persistence };
};

export const annulusPersistenceClassifierTool = createSimpleTool({
  id: "mycology/annulus-persistence-classifier",
  title: "Annulus Persistence",
  description:
    "Classify how long a partial veil annulus persists on the stipe.",
  inputs: [
    {
      enum: PERSISTENCE_STATES,
      id: "persistence",
      kind: "string",
      label: "Persistence",
    },
  ],
  outputs: [
    {
      id: "interpretation",
      kind: "string",
      label: "Interpretation",
    },
    {
      enum: PERSISTENCE_STATES,
      id: "persistenceClass",
      kind: "string",
      label: "Persistence class",
    },
  ],
  calculate: (input) =>
    calculateAnnulusPersistenceClassifier({
      persistence:
        input.persistence as AnnulusPersistenceClassifierInput["persistence"],
    }),
});
export const runAnnulusPersistenceClassifier =
  annulusPersistenceClassifierTool.execute;
export default annulusPersistenceClassifierTool;
