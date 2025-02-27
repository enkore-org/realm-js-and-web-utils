import {
	parseCode,
	mapImportSpecifiers
} from "@aniojs/node-ts-utils"

export function getImportSpecifiers(
	code: string
): string[] {
	let importSpecifiers: string[] = []

	mapImportSpecifiers(
		parseCode(code), (importSpecifier) => {
			importSpecifiers.push(importSpecifier)

			return importSpecifier
		}
	)

	return importSpecifiers
}
