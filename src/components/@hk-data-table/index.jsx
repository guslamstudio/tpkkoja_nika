import React from 'react';
import PropTypes from 'prop-types';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import classNames from 'classnames';
import { Form, Table } from 'react-bootstrap';
import { Star } from 'react-feather';
import { ArrowsSort, SortAscending, SortDescending } from 'tabler-icons-react';
import TableFooter from './TableFooter';

const getComparableValue = (value) => {
    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (item && typeof item === 'object') {
                    return Object.values(item).join(' ');
                }
                return item;
            })
            .join(' ');
    }

    if (React.isValidElement(value)) {
        return '';
    }

    if (value && typeof value === 'object') {
        return Object.values(value).join(' ');
    }

    return value ?? '';
};

const globalFilterFn = (row, columnId, filterValue) => {
    const searchTerm = String(filterValue ?? '').toLowerCase();

    if (!searchTerm) {
        return true;
    }

    return Object.values(row.original).some((value) =>
        String(getComparableValue(value)).toLowerCase().includes(searchTerm)
    );
};

const HkDataTable = ({
    column,
    rowData,
    bsPrefix,
    classes,
    striped,
    bordered,
    borderless,
    hover,
    size,
    variant,
    responsive,
    rowsPerPage,
    paginatorSize,
    rowSelection,
    searchBar,
    searchQuery,
    searchClasses,
    markStarred,
    ...rest
}) => {

    const [data, setData] = React.useState(() => rowData);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sorting, setSorting] = React.useState([]);
    const [rowSelectionState, setRowSelectionState] = React.useState({});
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: rowsPerPage || rowData.length || 10,
    });

    React.useEffect(() => {
        setData(rowData);
    }, [rowData]);

    React.useEffect(() => {
        if (searchQuery) {
            setSearchTerm(searchQuery);
        }
        else {
            setSearchTerm('');
        }
    }, [searchQuery])

    React.useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            pageIndex: 0,
            pageSize: rowsPerPage || data.length || 10,
        }));
    }, [data.length, rowsPerPage, searchTerm]);

    const tableColumns = React.useMemo(() => (
        column.map((cols) => ({
            id: cols.accessor,
            accessorKey: cols.accessor,
            header: cols.title,
            enableSorting: Boolean(cols.sort),
            sortingFn: (rowA, rowB, columnId) => {
                const a = cols.sortValue
                    ? cols.sortValue(rowA.original[columnId], rowA.original)
                    : getComparableValue(rowA.original[columnId]);
                const b = cols.sortValue
                    ? cols.sortValue(rowB.original[columnId], rowB.original)
                    : getComparableValue(rowB.original[columnId]);

                return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
            },
            cell: ({ row }) => (
                cols.cellFormatter
                    ? cols.cellFormatter(row.original[cols.accessor], row.original)
                    : row.original[cols.accessor]
            ),
            meta: cols,
        }))
    ), [column]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        state: {
            sorting,
            globalFilter: searchTerm,
            rowSelection: rowSelectionState,
            pagination,
        },
        enableRowSelection: Boolean(rowSelection),
        globalFilterFn,
        onSortingChange: setSorting,
        onGlobalFilterChange: setSearchTerm,
        onRowSelectionChange: setRowSelectionState,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const visibleRows = table.getRowModel().rows;
    const pageCount = table.getPageCount();
    const range = rowsPerPage ? Array.from({ length: pageCount }, (_, index) => index + 1) : [];
    const sortConfig = sorting[0] ? {
        key: sorting[0].id,
        direction: sorting[0].desc ? 'descending' : 'ascending',
    } : null;

    const handleStared = (rowIndex) => {
        setData((prevData) => prevData.map((row, index) => (
            index === rowIndex ? { ...row, starred: !row.starred } : row
        )));
    };

    return (
        <>
            {(searchBar && !searchQuery) && <Form.Group controlId="searchForm" className="mb-3">
                <Form.Control
                    type="search"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={searchClasses}
                />
            </Form.Group>}
            <Table
                bsPrefix={bsPrefix}
                className={classNames("hk-data-table", classes)}
                striped={striped}
                bordered={bordered}
                borderless={borderless}
                hover={hover}
                size={size}
                variant={variant}
                responsive={responsive}
                {...rest}
            >
                <thead>
                    <tr>
                        {(rowSelection || markStarred) && <th>
                            {rowSelection ? <Form.Check
                                type="checkbox"
                                className="fs-6 mb-0"
                                checked={table.getIsAllPageRowsSelected()}
                                onChange={table.getToggleAllPageRowsSelectedHandler()}
                            />
                                :
                                <></>
                            }

                        </th>}
                        {table.getHeaderGroups()[0].headers.map((header) => {
                            const cols = header.column.columnDef.meta;
                            const isSorted = header.column.getIsSorted();

                            return (
                            <th
                                key={header.id}
                                onClick={header.column.getToggleSortingHandler()}
                                className={classNames({ 'd-none': cols.hidden }, { "text-primary": sortConfig !== null && sortConfig.key === cols.accessor }, cols.className)}
                                rowSpan={cols.rowSpan}
                            >
                                <span className="d-flex">
                                    <span className="flex-grow-1">
                                        {cols.title}
                                    </span>
                                    {
                                        cols.sort &&
                                        <span>
                                            {(sortConfig !== null && cols.accessor === sortConfig.key)
                                                ?
                                                <>
                                                    {
                                                        (isSorted === 'asc')
                                                            ?
                                                            <font color="#007D88">
                                                                <SortAscending size={14} strokeWidth={2.5} />
                                                            </font>
                                                            :
                                                            <font color="#007D88">
                                                                <SortDescending size={14} strokeWidth={2.5} />
                                                            </font>
                                                    }
                                                </>
                                                :
                                                <span><ArrowsSort size={14} strokeWidth={2.5} /> </span>}
                                        </span>
                                    }
                                </span>
                            </th>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {/* slice.map */}
                    {visibleRows.map((row) => (
                        <tr key={row.id} className={classNames({ "selected": row.getIsSelected() })}>
                            {(rowSelection || markStarred) && <td>
                                <div className="d-flex align-items-center">
                                    {rowSelection && <Form.Check
                                        type="checkbox"
                                        className="form-check fs-6 mb-0"
                                        checked={row.getIsSelected()}
                                        onChange={row.getToggleSelectedHandler()}
                                    />}
                                    {markStarred && <span className={classNames("fav-star", { "marked": row.original.starred })} onClick={() => handleStared(row.index)} >
                                        <span className="feather-icon">
                                            <Star />
                                        </span>
                                    </span>}
                                </div>
                            </td>}
                            {row.getVisibleCells().map((cell) => {
                                const cols = cell.column.columnDef.meta;

                                return (
                                <td
                                    key={cell.id}
                                    className={classNames({ 'd-none': cols.hidden }, cols.tdClasses)}
                                >
                                    {cell.column.columnDef.cell(cell.getContext())}
                                </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </Table >
            {rowsPerPage && <TableFooter
                range={range}
                slice={visibleRows}
                setPage={(page) => table.setPageIndex(page - 1)}
                page={table.getState().pagination.pageIndex + 1}
                totalRows={table.getFilteredRowModel().rows}
                paginatorSize={paginatorSize}
            />}
        </>
    )
}

HkDataTable.propTypes = {
    column: PropTypes.array.isRequired,
    rowData: PropTypes.array.isRequired,
    bsPrefix: PropTypes.string,
    classes: PropTypes.string,
    striped: PropTypes.bool,
    bordered: PropTypes.bool,
    borderless: PropTypes.bool,
    hover: PropTypes.bool,
    size: PropTypes.string,
    variant: PropTypes.string,
    responsive: PropTypes.bool,
    rowsPerPage: PropTypes.number,
    paginatorSize: PropTypes.string,
    rowSelection: PropTypes.bool,
    searchBar: PropTypes.bool,
    searchQuery: PropTypes.string,
    searchClasses: PropTypes.string,
    markStarred: PropTypes.bool,
}

export default HkDataTable
