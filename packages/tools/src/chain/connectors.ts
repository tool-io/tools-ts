import type { ToolPortDefinition } from "../core/definition.js";
import { arePortTypesCompatible } from "./tool.js";
import type {
  ChainConnectionRecommendation,
  ChainConnectorCandidate,
  ChainToolDefinition,
} from "./types.js";

export const recommendOneStepConnectors = (
  sourceOutput: ToolPortDefinition,
  targetInput: ToolPortDefinition,
  tools: Iterable<ChainToolDefinition>,
): readonly ChainConnectorCandidate[] => {
  const candidates: ChainConnectorCandidate[] = [];
  for (const tool of tools) {
    if (!tool.ports.connector) continue;
    for (const input of tool.ports.inputs) {
      if (!arePortTypesCompatible(sourceOutput, input)) continue;
      for (const output of tool.ports.outputs) {
        if (!arePortTypesCompatible(output, targetInput)) continue;
        candidates.push({
          inputPortId: input.id,
          outputPortId: output.id,
          requiredInputPortIds: tool.ports.inputs
            .filter((port) => port.required && port.id !== input.id)
            .map((port) => port.id),
          title: tool.title,
          toolId: tool.id,
          toolVersion: tool.contractVersion,
        });
      }
    }
  }

  return candidates.sort(
    (first, second) =>
      first.requiredInputPortIds.length - second.requiredInputPortIds.length ||
      first.title.localeCompare(second.title) ||
      first.toolId.localeCompare(second.toolId) ||
      first.inputPortId.localeCompare(second.inputPortId) ||
      first.outputPortId.localeCompare(second.outputPortId),
  );
};

export const recommendConnection = (
  sourceOutput: ToolPortDefinition,
  targetInput: ToolPortDefinition,
  tools: Iterable<ChainToolDefinition>,
): ChainConnectionRecommendation => ({
  connectors: arePortTypesCompatible(sourceOutput, targetInput)
    ? []
    : recommendOneStepConnectors(sourceOutput, targetInput, tools),
  direct: arePortTypesCompatible(sourceOutput, targetInput),
});
