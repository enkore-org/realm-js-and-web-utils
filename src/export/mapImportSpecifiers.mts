import {
	parseCode,
	mapImportSpecifiers as impl,
	printNode
} from "@aniojs/node-ts-utils"

type Mapper = (moduleSpecifier: string) => string

export function mapImportSpecifiers(
	code: string, mapper: Mapper
): string {
	return printNode(
		impl(
			parseCode(code), mapper
		)
	)
}
