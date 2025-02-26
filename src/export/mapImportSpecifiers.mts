import {
	parseCode,
	mapImportSpecifiers as impl,
	printNode
} from "@aniojs/node-ts-utils"

type Mapper = Parameters<typeof impl>[1]

export function mapImportSpecifiers(
	code: string, mapper: Mapper
): string {
	return printNode(
		impl(
			parseCode(code), mapper
		)
	)
}
