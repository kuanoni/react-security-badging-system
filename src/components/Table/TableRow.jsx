import React from 'react';
import { flexRender } from '@tanstack/react-table';

const TableRow = React.memo(({ originalId, visibleCells, height, handleRowClick }) => {
	return (
		<tr key={originalId} onClick={(e) => handleRowClick(e, originalId)}>
			{visibleCells.map((cell) => {
				return (
					<td key={cell.id} style={{ height }}>
						{flexRender(cell.column.columnDef.cell, cell.getContext())}
					</td>
				);
			})}
		</tr>
	);
});

export default TableRow;
