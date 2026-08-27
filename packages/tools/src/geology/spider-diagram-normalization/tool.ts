import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpiderDiagramNormalizationInput = {
  readonly elements: readonly string[];
  readonly concentrationsPpm: readonly number[];
};

export type SpiderDiagramNormalizationOutput = {
  readonly normalizedValues: readonly number[];
};

const PRIMITIVE_MANTLE_PPM = {
  cs: 0.018,
  rb: 0.635,
  ba: 6.989,
  th: 0.085,
  u: 0.021,
  nb: 0.658,
  ta: 0.041,
  la: 0.687,
  ce: 1.775,
  sr: 21.1,
  nd: 1.354,
  sm: 0.444,
  zr: 5.282,
  hf: 0.309,
  ti: 1300,
  y: 4.55,
  yb: 0.458,
} as const;

type SupportedElement = keyof typeof PRIMITIVE_MANTLE_PPM;
const SUPPORTED = Object.keys(PRIMITIVE_MANTLE_PPM) as SupportedElement[];

export const calculateSpiderDiagramNormalization = (
  input: SpiderDiagramNormalizationInput,
): SpiderDiagramNormalizationOutput => {
  if (input.elements.length !== input.concentrationsPpm.length)
    simpleError(
      "concentrationsPpm",
      "One concentration per element is required.",
      "length_mismatch",
    );
  const normalizedValues = input.elements.map((raw, index) => {
    const element = raw.trim().toLowerCase();
    if (!SUPPORTED.includes(element as SupportedElement))
      simpleError(
        "elements",
        `Unsupported element "${raw}". Supported: ${SUPPORTED.join(", ")}.`,
        "unsupported_element",
      );
    const value = input.concentrationsPpm[index] as number;
    if (!(value > 0))
      simpleError(
        "concentrationsPpm",
        "Concentrations must be greater than zero.",
        "invalid_concentration",
      );
    return value / PRIMITIVE_MANTLE_PPM[element as SupportedElement];
  });
  return { normalizedValues };
};

export const spiderDiagramNormalizationExample = {
  input: {
    elements: ["rb", "ba", "th", "nb", "la", "yb"],
    concentrationsPpm: [30, 300, 5, 15, 45, 4],
  },
  output: {
    normalizedValues: [
      47.24409448818898, 42.924595793389614, 58.8235294117647,
      22.796352583586625, 65.50218340611353, 8.73362445414847,
    ],
  },
} satisfies ToolExample<
  SpiderDiagramNormalizationInput,
  SpiderDiagramNormalizationOutput
>;

export const spiderDiagramNormalizationTool = createSimpleTool({
  id: "geology/spider-diagram-normalization",
  title: "Spider Diagram Normalization Calculator",
  description:
    "Normalize incompatible-trace-element concentrations to the Sun and McDonough (1989) primitive mantle for spider diagrams.",
  inputs: [
    {
      description: "Element symbols ordered as plotted.",
      id: "elements",
      kind: "stringList",
      label: "Elements",
    },
    {
      description: "Matching concentrations in ppm.",
      id: "concentrationsPpm",
      kind: "numberList",
      label: "Concentrations",
    },
  ],
  outputs: [
    {
      description: "Primitive-mantle-normalized values in input order.",
      id: "normalizedValues",
      kind: "numberList",
      label: "Normalized values",
    },
  ],
  calculate: (input) =>
    calculateSpiderDiagramNormalization(
      input as unknown as SpiderDiagramNormalizationInput,
    ),
});

export const runSpiderDiagramNormalization =
  spiderDiagramNormalizationTool.execute;
export default spiderDiagramNormalizationTool;
