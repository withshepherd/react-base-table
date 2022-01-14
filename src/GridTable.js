import cn from 'classnames';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';
import React from 'react';
import { FixedSizeGrid, VariableSizeGrid } from 'react-window';
import TableFooter from './TableFooter';
import Header from './TableHeader';
import { getEstimatedTotalRowsHeight } from './utils';

/**
 * A wrapper of the Grid for internal only
 */
class GridTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this._setHeaderRef = this._setHeaderRef.bind(this);
    this._setBodyRef = this._setBodyRef.bind(this);
    this._setFooterRef = this._setFooterRef.bind(this);
    this._setInnerRef = this._setInnerRef.bind(this);
    this._itemKey = this._itemKey.bind(this);
    this._getBodyWidth = this._getBodyWidth.bind(this);
    this._handleItemsRendered = this._handleItemsRendered.bind(this);
    this._resetColumnWidthCache = memoize(bodyWidth => {
      if (!this.props.estimatedRowHeight) return;
      this.bodyRef && this.bodyRef.resetAfterColumnIndex(0, false);
    });
    this._getEstimatedTotalRowsHeight = memoize(getEstimatedTotalRowsHeight);

    this.renderRow = this.renderRow.bind(this);
    this.renderBody = this.renderBody.bind(this);
  }

  resetAfterRowIndex(rowIndex = 0, shouldForceUpdate) {
    if (!this.props.estimatedRowHeight) return;
    this.bodyRef && this.bodyRef.resetAfterRowIndex(rowIndex, shouldForceUpdate);
  }

  forceUpdateTable() {
    this.headerRef && this.headerRef.forceUpdate();
    this.bodyRef && this.bodyRef.forceUpdate();
    this.footerRef && this.footerRef.forceUpdate();
  }

  scrollToPosition(args) {
    this.headerRef && this.headerRef.scrollTo(args.scrollLeft);
    this.bodyRef && this.bodyRef.scrollTo(args);
    this.footerRef && this.footerRef.scrollTo(args.scrollLeft);
  }

  scrollToTop(scrollTop) {
    this.bodyRef && this.bodyRef.scrollTo({ scrollTop });
  }

  scrollToLeft(scrollLeft) {
    this.headerRef && this.headerRef.scrollTo(scrollLeft);
    this.bodyRef && this.bodyRef.scrollToPosition({ scrollLeft });
    this.footerRef && this.footerRef.scrollTo(scrollLeft);
  }

  scrollToRow(rowIndex = 0, align = 'auto') {
    this.bodyRef && this.bodyRef.scrollToItem({ rowIndex, align });
  }

  getTotalRowsHeight() {
    const { data, rowHeight, estimatedRowHeight } = this.props;

    if (estimatedRowHeight) {
      return (
        (this.innerRef && this.innerRef.clientHeight) || this._getEstimatedTotalRowsHeight(data, estimatedRowHeight)
      );
    }
    return data.length * rowHeight;
  }

  renderRow(args) {
    const { data, columns, rowRenderer } = this.props;
    const rowData = data[args.rowIndex];
    return rowRenderer({ ...args, columns, rowData });
  }

  renderBody({ style, ...all }) {
    const { data, rowHeight } = this.props;

    return (
      <>{data.map((d, rowIndex) => this.renderRow({ style: { ...style, top: rowHeight * rowIndex }, rowIndex }))}</>
    );
  }

  render() {
    const {
      containerStyle,
      classPrefix,
      className,
      data,
      frozenData,
      width,
      height,
      rowHeight,
      estimatedRowHeight,
      getRowHeight,
      headerWidth,
      bodyWidth,
      useIsScrolling,
      onScroll,
      hoveredRowKey,
      overscanRowCount,
      // omit from rest
      style,
      onScrollbarPresenceChange,
      virtualized,
      ...rest
    } = this.props;
    const headerHeight = this._getHeaderHeight();
    const footerHeight = this._getFooterHeight();
    const frozenRowCount = frozenData.length;
    const frozenRowsHeight = rowHeight * frozenRowCount;
    const cls = cn(`${classPrefix}__table`, className);
    const containerProps = containerStyle ? { style: containerStyle } : null;
    const Grid = estimatedRowHeight ? VariableSizeGrid : FixedSizeGrid;

    this._resetColumnWidthCache(bodyWidth);

    return (
      <div role="table" className={cls} {...containerProps}>
        {footerHeight > 0 && (
          // put header after body and reverse the display order via css
          // to prevent header's shadow being covered by body
          <TableFooter
            {...rest}
            className={`${classPrefix}__footer`}
            ref={this._setFooterRef}
            data={data}
            frozenData={frozenData}
            width={width}
            height={Math.min(footerHeight + frozenRowsHeight, height)}
            rowWidth={headerWidth}
            rowHeight={rowHeight}
            footerHeight={this.props.footerHeight}
            footerRenderer={this.props.footerRenderer}
            rowRenderer={this.props.rowRenderer}
            hoveredRowKey={frozenRowCount > 0 ? hoveredRowKey : null}
          />
        )}

        <Grid
          {...rest}
          className={`${classPrefix}__body`}
          ref={this._setBodyRef}
          innerRef={this._setInnerRef}
          itemKey={this._itemKey}
          data={data}
          frozenData={frozenData}
          width={width}
          height={Math.max(height - headerHeight - frozenRowsHeight, 0)}
          rowHeight={estimatedRowHeight ? getRowHeight : rowHeight}
          estimatedRowHeight={typeof estimatedRowHeight === 'function' ? undefined : estimatedRowHeight}
          rowCount={virtualized ? data.length : 1}
          overscanRowCount={virtualized ? overscanRowCount : 0}
          columnWidth={estimatedRowHeight ? this._getBodyWidth : bodyWidth}
          columnCount={1}
          overscanColumnCount={0}
          useIsScrolling={useIsScrolling}
          hoveredRowKey={hoveredRowKey}
          onScroll={onScroll}
          onItemsRendered={this._handleItemsRendered}
          children={virtualized ? this.renderRow : this.renderBody}
        />

        {headerHeight + frozenRowsHeight > 0 && (
          // put header after body and reverse the display order via css
          // to prevent header's shadow being covered by body
          <Header
            {...rest}
            className={`${classPrefix}__header`}
            ref={this._setHeaderRef}
            data={data}
            frozenData={frozenData}
            width={width}
            height={Math.min(headerHeight + frozenRowsHeight, height)}
            rowWidth={headerWidth}
            rowHeight={rowHeight}
            headerHeight={this.props.headerHeight}
            headerRenderer={this.props.headerRenderer}
            rowRenderer={this.props.rowRenderer}
            hoveredRowKey={frozenRowCount > 0 ? hoveredRowKey : null}
          />
        )}
      </div>
    );
  }

  _setHeaderRef(ref) {
    this.headerRef = ref;
  }

  _setBodyRef(ref) {
    this.bodyRef = ref;
  }

  _setFooterRef(ref) {
    this.footerRef = ref;
  }

  _setInnerRef(ref) {
    this.innerRef = ref;
  }

  _itemKey({ rowIndex }) {
    const { data, rowKey } = this.props;
    return data[rowIndex][rowKey];
  }

  _getHeaderHeight() {
    const { headerHeight } = this.props;
    if (Array.isArray(headerHeight)) {
      return headerHeight.reduce((sum, height) => sum + height, 0);
    }
    return headerHeight;
  }

  _getFooterHeight() {
    const { footerHeight } = this.props;
    if (Array.isArray(footerHeight)) {
      return footerHeight.reduce((sum, height) => sum + height, 0);
    }
    return footerHeight;
  }

  _getBodyWidth() {
    return this.props.bodyWidth;
  }

  _handleItemsRendered({ overscanRowStartIndex, overscanRowStopIndex, visibleRowStartIndex, visibleRowStopIndex }) {
    this.props.onRowsRendered({
      overscanStartIndex: overscanRowStartIndex,
      overscanStopIndex: overscanRowStopIndex,
      startIndex: visibleRowStartIndex,
      stopIndex: visibleRowStopIndex,
    });
  }
}

GridTable.propTypes = {
  containerStyle: PropTypes.object,
  classPrefix: PropTypes.string,
  className: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  headerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
  footerHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
  headerWidth: PropTypes.number.isRequired,
  bodyWidth: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  estimatedRowHeight: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
  getRowHeight: PropTypes.func,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.array.isRequired,
  frozenData: PropTypes.array,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  useIsScrolling: PropTypes.bool,
  overscanRowCount: PropTypes.number,
  hoveredRowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  onScrollbarPresenceChange: PropTypes.func,
  onScroll: PropTypes.func,
  onRowsRendered: PropTypes.func,
  headerRenderer: PropTypes.func.isRequired,
  footerRenderer: PropTypes.func.isRequired,
  rowRenderer: PropTypes.func.isRequired,
  virtualized: PropTypes.bool.isRequired,
};

export default GridTable;
