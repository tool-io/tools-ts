import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const themes = {
  community: {
    caution:
      "Do not flatten the many cultures and histories grouped by broad labels.",
    prompts: [
      "Who builds and governs the technology as a community practice?",
      "How might kinship, collective memory, and mutual aid shape adoption?",
    ],
  },
  ecology: {
    caution:
      "Center the perspectives and knowledge of communities most affected by environmental change.",
    prompts: [
      "How might technology restore landscapes, biodiversity, or material reciprocity?",
      "What environmental constraints shape the imagined future?",
    ],
  },
  identity: {
    caution: "Avoid treating any culture as uniform, timeless, or ahistorical.",
    prompts: [
      "How do people preserve, transform, or contest identity through technology?",
      "Whose histories, aesthetics, and future imaginaries are included or excluded?",
    ],
  },
  technology: {
    caution:
      "Pair technical possibility with local authority, material conditions, and historical power.",
    prompts: [
      "What tools become possible, and what older practices do they extend or disrupt?",
      "Who controls the infrastructure, data, standards, and maintenance?",
    ],
  },
} as const;

export type AfrofuturismTheme = keyof typeof themes;

export type AfrofuturismLookupInput = {
  readonly theme: AfrofuturismTheme;
};

export type AfrofuturismLookupOutput = {
  readonly culturalCaution: string;
  readonly imaginationPrompts: ReadonlyArray<string>;
  readonly theme: AfrofuturismTheme;
};

export const lookupAfrofuturismCulturalImagination = (
  input: AfrofuturismLookupInput,
): AfrofuturismLookupOutput => {
  const theme = themes[input.theme];
  if (theme === undefined)
    simpleError(
      "theme",
      "Afrofuturism theme is not supported.",
      "unsupported_afrofuturism_theme",
    );
  return {
    culturalCaution: theme.caution,
    imaginationPrompts: [...theme.prompts],
    theme: input.theme,
  };
};

export const afrofuturismLookupExample = {
  input: { theme: "identity" },
  output: {
    culturalCaution:
      "Avoid treating any culture as uniform, timeless, or ahistorical.",
    imaginationPrompts: [
      "How do people preserve, transform, or contest identity through technology?",
      "Whose histories, aesthetics, and future imaginaries are included or excluded?",
    ],
    theme: "identity",
  },
} satisfies ToolExample<AfrofuturismLookupInput, AfrofuturismLookupOutput>;

export const afrofuturismLookupTool = createSimpleTool({
  calculate: (input) =>
    lookupAfrofuturismCulturalImagination({
      theme: input.theme as AfrofuturismTheme,
    }),
  description:
    "Return culturally grounded Afrofuturism imagination prompts and cautions for identity, community, ecology, or technology themes.",
  id: "futurology/afrofuturism-cultural-tech-imagination-lookup",
  inputs: [
    {
      enum: ["identity", "community", "ecology", "technology"],
      id: "theme",
      kind: "string",
      label: "Afrofuturism theme",
    },
  ],
  outputs: [
    { id: "culturalCaution", kind: "string", label: "Cultural caution" },
    {
      id: "imaginationPrompts",
      kind: "stringList",
      label: "Imagination prompts",
    },
    { id: "theme", kind: "string", label: "Afrofuturism theme" },
  ],
  title: "Afrofuturism Cultural Tech Imagination Lookup",
});

export const runAfrofuturismLookup = afrofuturismLookupTool.execute;
export default afrofuturismLookupTool;
