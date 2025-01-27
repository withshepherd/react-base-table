import faker from '@withshepherd/faker'
import React from 'react'
import BaseTable, {
  AutoResizer,
  callOrReturn,
  Column,
  normalizeColumns,
  SortOrder,
  TableHeader as BaseTableHeader,
  TableRow as BaseTableRow,
  unflatten,
} from 'react-base-table'
import BaseTableExpandIcon from 'react-base-table/ExpandIcon'
import ReactDOM from 'react-dom'
import * as ReactOverlays from 'react-overlays'
import * as ReactSortableHoc from 'react-sortable-hoc'
import ReactTexty from 'react-texty'
import styled, { createGlobalStyle, css, keyframes } from 'styled-components'

const generateColumns = (count = 10, prefix = 'column-', props) =>
  new Array(count).fill(0).map((column, columnIndex) => ({
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
    ...props,
  }))

const generateData = (columns, count = 200, prefix = 'row-') =>
  new Array(count).fill(0).map((row, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

const noop = () => {}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const action = (message) => (args) => console.log(message, args)

const Table = React.forwardRef((props, ref) => (
  <BaseTable ref={ref} width={700} height={400} {...props} />
))
Table.Column = Column
Table.PlaceholderKey = BaseTable.PlaceholderKey

export default {
  React,
  ReactDOM,

  styled,
  css,
  keyframes,
  createGlobalStyle,

  ReactSortableHoc,
  ReactOverlays,
  ReactTexty,
  faker,

  BaseTable,
  Column,
  SortOrder,
  AutoResizer,
  normalizeColumns,
  callOrReturn,
  unflatten,
  BaseTableRow,
  BaseTableHeader,
  BaseTableExpandIcon,

  generateColumns,
  generateData,
  noop,
  delay,
  action,
  Table,
}
