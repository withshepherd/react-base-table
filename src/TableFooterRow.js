import PropTypes from 'prop-types';
import React from 'react';
import { renderElement } from './utils';

/**
 * FooterRow component for BaseTable
 */
const TableFooterRow = ({
  className,
  style,
  columns,
  footerIndex,
  cellRenderer,
  footerRenderer,
  expandColumnKey,
  expandIcon: ExpandIcon,
  tagName: Tag,
  ...rest
}) => {
  let cells = columns.map((column, columnIndex) =>
    cellRenderer({
      columns,
      column,
      columnIndex,
      footerIndex,
      expandIcon: column.key === expandColumnKey && <ExpandIcon />,
    })
  );

  if (footerRenderer) {
    cells = renderElement(footerRenderer, { cells, columns, footerIndex });
  }

  return (
    <Tag {...rest} className={className} style={style}>
      {cells}
    </Tag>
  );
};

TableFooterRow.defaultProps = {
  tagName: 'div',
};

TableFooterRow.propTypes = {
  isScrolling: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  footerIndex: PropTypes.number,
  cellRenderer: PropTypes.func,
  footerRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  expandColumnKey: PropTypes.string,
  expandIcon: PropTypes.func,
  tagName: PropTypes.elementType,
};

export default TableFooterRow;
