import {
	parseCode,
	resolveImportAliases as impl,
	printNode
} from "@aniojs/node-ts-utils"

type Aliases = {[key: string]: string}

export function resolveImportAliases(
	code: string, aliases: Aliases
): string {
	return printNode(
		impl(
			parseCode(code), aliases
		)
	)
}
