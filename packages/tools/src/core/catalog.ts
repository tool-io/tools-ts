import type {
  ToolDefinition,
  ToolDiscovery,
  ToolExecutionRequirements,
  ToolPortsDefinition,
} from "./definition.js";
import { portableToolContract } from "./portable-contract.js";

export const toolCatalogSchemaVersion = 1 as const;

export type ToolCatalogEntry = {
  readonly aliases: readonly string[];
  readonly canonicalUrl: string;
  readonly collections: readonly string[];
  readonly contractFingerprint: string;
  readonly contractVersion: number;
  readonly description: string;
  readonly execution: ToolExecutionRequirements;
  readonly fields: readonly string[];
  readonly id: string;
  readonly implementedAt: string;
  readonly keywords: readonly string[];
  readonly packageExport: string;
  readonly ports: ToolPortsDefinition;
  readonly title: string;
};

export type ToolCatalog = {
  readonly entries: readonly ToolCatalogEntry[];
  readonly schemaVersion: typeof toolCatalogSchemaVersion;
};

const normalizeList = (
  values: readonly string[] | undefined,
): readonly string[] =>
  [
    ...new Set((values ?? []).map((value) => value.trim()).filter(Boolean)),
  ].sort((left, right) => left.localeCompare(right, "en"));

export const normalizeToolDiscovery = (
  discovery: ToolDiscovery | undefined,
): Required<ToolDiscovery> => ({
  aliases: normalizeList(discovery?.aliases),
  collections: normalizeList(discovery?.collections),
  fields: normalizeList(discovery?.fields),
  keywords: normalizeList(discovery?.keywords),
});

export const toolCatalogSource = (
  definition: ToolDefinition<unknown, unknown>,
) => portableToolContract(definition);

export const createToolCatalogEntry = (
  definition: ToolDefinition<unknown, unknown>,
  contractFingerprint: string,
  implementedAt: string,
): ToolCatalogEntry => {
  if (Number.isNaN(Date.parse(implementedAt))) {
    throw new TypeError("Tool implementation date must be a valid date-time.");
  }

  return {
    ...normalizeToolDiscovery(definition.discovery),
    canonicalUrl: `/${definition.id}`,
    contractFingerprint,
    contractVersion: definition.contractVersion,
    description: definition.description,
    execution: definition.execution,
    id: definition.id,
    implementedAt,
    packageExport: `@tool.io/tools/${definition.id}`,
    ports: definition.ports,
    title: definition.title,
  };
};
