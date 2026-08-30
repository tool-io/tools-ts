import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const components = [
  "control_environment",
  "risk_assessment",
  "control_activities",
  "information_and_communication",
  "monitoring_activities",
] as const;

type CosoComponent = (typeof components)[number];

export type CosoMappingInput = {
  readonly controlElements: ReadonlyArray<string>;
};

export type CosoMappingOutput = {
  readonly completeCoverage: boolean;
  readonly coveredComponents: ReadonlyArray<CosoComponent>;
  readonly mappedElements: number;
  readonly missingComponents: ReadonlyArray<CosoComponent>;
};

export const mapCosoControlElements = (
  input: CosoMappingInput,
): CosoMappingOutput => {
  if (!Array.isArray(input.controlElements))
    simpleError(
      "controlElements",
      "Control elements must be an array.",
      "control_elements_required",
    );
  const covered = new Set<CosoComponent>();
  let mappedElements = 0;
  for (const [index, value] of input.controlElements.entries()) {
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        `controlElements.${index}`,
        "Each control element must use a nonempty component label.",
        "invalid_control_element",
      );
    const normalized = value
      .trim()
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/gu, "_");
    if (components.some((component) => component === normalized)) {
      covered.add(normalized as CosoComponent);
      mappedElements += 1;
    }
  }
  const missingComponents = components.filter(
    (component) => !covered.has(component),
  );
  return {
    completeCoverage: missingComponents.length === 0,
    coveredComponents: components.filter((component) => covered.has(component)),
    mappedElements,
    missingComponents,
  };
};

export const cosoMappingExample = {
  input: {
    controlElements: [
      "Control Environment",
      "risk assessment",
      "information and communication",
    ],
  },
  output: {
    completeCoverage: false,
    coveredComponents: [
      "control_environment",
      "risk_assessment",
      "information_and_communication",
    ],
    mappedElements: 3,
    missingComponents: ["control_activities", "monitoring_activities"],
  },
} satisfies ToolExample<CosoMappingInput, CosoMappingOutput>;

export const cosoMappingTool = createSimpleTool({
  calculate: (input) =>
    mapCosoControlElements({
      controlElements: input.controlElements as string[],
    }),
  description:
    "Map supplied control-element labels to the five COSO component names and report which components remain unmapped.",
  id: "auditing/coso-five-components-element-mapping-grid",
  inputs: [
    {
      description:
        "Control-element labels mapped to control environment, risk assessment, control activities, information and communication, or monitoring activities.",
      id: "controlElements",
      kind: "stringList",
      label: "Control elements",
    },
  ],
  outputs: [
    {
      id: "completeCoverage",
      kind: "boolean",
      label: "All components mapped",
    },
    {
      id: "coveredComponents",
      kind: "stringList",
      label: "Covered components",
    },
    {
      id: "mappedElements",
      kind: "integer",
      label: "Mapped elements",
      minimum: 0,
    },
    {
      id: "missingComponents",
      kind: "stringList",
      label: "Missing components",
    },
  ],
  title: "COSO Five Components Element Mapping Grid",
});

export const runCosoMapping = cosoMappingTool.execute;
export default cosoMappingTool;
